import type { NextApiRequest, NextApiResponse } from 'next'
import type { Category } from '@prisma/client';
import { prisma } from '../../../libs/server/prisma';


export default async function handlerCategories(req: NextApiRequest, res: NextApiResponse<Category | Category[] | any>): Promise<void> {

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


async function handleGet(req: NextApiRequest, res: NextApiResponse<Category[] | any>): Promise<void> {
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

  const categroies = await queryFunc(
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

  res.status(200).json(categroies)
  return
}


async function handlePost(req: NextApiRequest, res: NextApiResponse<Category[] | any>): Promise<void> {
  if (!req.headers) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { name, parentId, menuId } = req.body

  if (!name || !menuId) {
    res.status(400).json({ message: "Bad Request" })
    return
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        parentId,
        isDeleted: false,
        menuId: menuId
      },
    }) as Category
    res.status(201).json(newCategory)
    return
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
    return
  }
}