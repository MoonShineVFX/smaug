import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../libs/server/prisma';


type CategoryReturnItem = {
  id: string;
  name: string | null;
  parentId: string | null;
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


export default async function handlerMenuTree(req: NextApiRequest, res: NextApiResponse<CategoryGetResponse | any>): Promise<void> {

  if (req.method !== 'GET') {
    res.status(405).json({ message: "Method not allowed" })
    return;
  }

  const { id } = req.query as { id: string }
  if (!id) {
    res.status(400).json({ message: "Bad Request" })
    return;
  }
  let menuId: string = id

  // get menu
  const menu = await prisma.menu.findUnique({
    where: {
      id: menuId
    },
  })

  if (!menu || menu.isDeleted || !menu.isVisible) {
    res.status(404).json({ message: "Menu Categories not found" })
    return
  }


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
        menuId: { equals: menuId }
      }
    }
  }

  const categroies: CategoryReturnItem[] = await prisma.category.findMany(
    {
      ...queryFilter,
      ...returnField
    }
  )

  // 把 category 整理成 id 為 key 值為 CategoryItem 的物件
  let categoryDict = {} as { [key: string]: CategoryItem }
  categroies.forEach((category) => {
    categoryDict[category.id] = {
      id: category.id,
      name: category.name!,
      children: [],
    }
  })

  // 利用 categoryDict 整理出 categoryTree，去除掉 category 為 Root 那一層
  let categoryTree = [] as CategoryItem[]
  categroies.forEach((category) => {
    if (category.parentId === null) {
      categoryTree.push(categoryDict[category.id])
    } else {
      categoryDict[category.parentId!].children.push(categoryDict[category.id])
    }

  })


  const categoryReturn = {
    id: menu.id,
    name: menu.name,
    iconName: menu.iconName,
    children: categoryTree,
  }

  res.status(200).json(categoryReturn)
  return
}