
import prisma from '../../client';
import { Prisma, Category } from '@prisma/client';
import { MenuWithCategoriesResponse, CategoryTree } from '../../libs/types';

export async function create(menuId: string, categoryName: string): Promise<Category> {
  try {
    const category = await prisma.category.create({
      data: {
        menuId: menuId,
        name: categoryName,
        createAt: new Date(),
      },
    })
    return category
  } catch (err: any) {
    throw new Error(err)
  }
}


// get By Menu Id
export async function getByMenuId(menuId: string): Promise<Category[]> {
  // get menu
  const menu = await prisma.menu.findUnique({
    where: {
      id: menuId
    },
  })

  if (!menu || menu.isDeleted || !menu.isVisible) {
    throw new Error("Menu Categories not found")
  }
  const returnField: Prisma.CategorySelect = {
    id: true,
    name: true,
    parentId: true
  }

  let queryFilter = {
    where: {
      AND: {
        isDeleted: { equals: false },
        isVisible: { equals: true },
        menuId: { equals: menuId }
      }
    }
  }

  const categories = await prisma.category.findMany(
    {
      ...queryFilter,
      select: returnField
    }
  )

  return categories
}


export async function list(): Promise<Category[]>{
  const categories = await prisma.category.findMany({
    where: {
      isDeleted: false
    }
  })
  return categories;
  
}
