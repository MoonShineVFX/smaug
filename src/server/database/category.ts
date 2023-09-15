
import prisma from '../../client';
import { Prisma, Category } from '@prisma/client';

type CategoryRecord = Pick<Category, 'id' | 'name' | 'parentId'>;

export async function getByMenu(menuId: string): Promise<CategoryRecord[]> {
  const returnField: Prisma.CategorySelect = {
    id: true,
    name: true,
    parentId: true
  }
  // let queryFilter = {
  //   where: {
  //     AND: {} as { [key: string]: { equals: Boolean | string; } }
  //   }
  // };

  const queryFilter = {
    where: {
      AND: {
        isDeleted: { equals: false },
        isVisible: { equals: true },
        menuId: { equals: menuId }
      }
    }
  }
  const categroies = await prisma.category.findMany(
    {
      ...queryFilter,
      select: returnField,
    }
  )

  return categroies
}


export async function create(categoryName: string): Promise<Category> {
  try {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
      },
    })
    return category
  } catch (err: any) {
    throw new Error(err)
  }
}
