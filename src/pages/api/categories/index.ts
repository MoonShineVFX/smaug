import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Category, Menu } from '@prisma/client';
import { prisma } from '../../../libs/server/prisma';

type CategoryReturnItem = {
  id: string;
  name: string;
  parentId: string;
}


type CategoryItem = {
  id: string;
  name: string;
  children: CategoryItem[];
}


type CategoryGetResponse = {
  id: string;
  name: string;
  iconName: string;
  children: CategoryItem[];

}
export default async function handlerCategories(req: NextApiRequest, res: NextApiResponse<CategoryGetResponse | any>): Promise<void> {

  if (req.method === undefined) {
    res.status(405).json({ message: "Method not allowed" })
    return;
  }
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'POST':
      await handlePost(req, res);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" })
  }

}


function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString(16);
}


async function handleGet(req: NextApiRequest, res: NextApiResponse<CategoryGetResponse[] | any>): Promise<void> {
  const { id, name } = req.query

  const returnField = {
    select: {
      id: true,
      name: true,
      parentId: true
    }
  }

  let queryFilter = {
    where: {
      AND: {} as { [key: string]: { equals: Boolean | string; } }
    }
  };

  queryFilter = {
    where: {
      AND: {
        isDeleted: { equals: false },
        isVisible: { equals: true },
      }
    }
  }

  let queryFunc: CallableFunction = prisma.category.findMany

  if (id) {
    queryFilter.where.AND = {
      ...queryFilter.where.AND,
      id: { equals: id as string },
    }
    queryFunc = prisma.category.findFirst
  }

  if (name) {
    queryFilter.where.AND = {
      ...queryFilter.where.AND,
      name: { equals: name as string },
    }
  }

  const categroies: CategoryReturnItem[] = await queryFunc(
    {
      ...queryFilter,
      ...returnField
    }
  )

  // get menu "category"
  const menuCategory = await prisma.menu.findUnique({
    where: {
      name: "Categories"
    },
  })

  if (!menuCategory) {
    res.status(404).json({ message: "Menu Categories not found" })
    return
  }

  // 把 category 整理成 id 為 key 值為 CategoryItem 的物件
  let categoryDict = {} as { [key: string]: CategoryItem }
  categroies.forEach((category) => {
    categoryDict[category.id] = {
      id: category.id,
      name: category.name,
      children: [],
    }
  })
  // 取的 Root 的 id
  let rootId = ''
  for (let key in categoryDict) {
    if (categoryDict[key].name === 'Root') {
      rootId = key
      break
    }
  }

  // 利用 categoryDict 整理出 categoryTree，去除掉 category 為 Root 那一層
  let categoryTree = [] as CategoryItem[]
  categroies.forEach((category) => {
    if (category.id !== rootId) {
      if (category.parentId === rootId) {
        categoryTree.push(categoryDict[category.id])
      } else {
        categoryDict[category.parentId].children.push(categoryDict[category.id])
      }
    }
  })


  let categoryReturn = {
    id: hashString(menuCategory.name),
    name: menuCategory.name,
    iconName: menuCategory.iconName,
    children: categoryTree,
  }

  res.status(200).json(categoryReturn)
  return
}


async function handlePost(req: NextApiRequest, res: NextApiResponse<Category[] | any>): Promise<void> {
  if (!req.headers) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }
  const { name, parentId, } = req.body
  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        parentId,
        isDeleted: false,
      },
    })
    res.status(201).json(newCategory)
    return
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
    return
  }
}