
import prisma from '../../client';
import { Prisma, Category } from '@prisma/client';


export async function create(createCategoryArgs: Prisma.CategoryCreateArgs['data']) {

  const newCategoryArgs = {
    ...createCategoryArgs,
    createAt: new Date(),
  }

  // category create, then update path
  const newCategory = await prisma.$transaction(async (tx) => {
    const category = await tx.category.create({
      data: newCategoryArgs
    });

    let thePath: string;
    if (newCategoryArgs.parentId) {
      const parentCategory = await tx.category.findUnique({
        where: {
          id: newCategoryArgs.parentId
        }
      });
      thePath = parentCategory ? `${parentCategory.path}/${category.id}` : `/${category.id}`;
    } else {
      thePath = `/${category.id}`;
    }

    const updatedCategory = await tx.category.update({
      data: {
        path: thePath
      },
      where: {
        id: category.id
      }
    });

    return updatedCategory;
  })

  return newCategory;
}


// get By Menu Id
export async function getByMenuId(menuId: string) {
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


export async function list() {
  const categories = await prisma.category.findMany({
    where: {
      isDeleted: false
    }
  })
  return categories;

}


export async function get(id: number) {
  const category = await prisma.category.findUnique({
    where: {
      id: id
    }
  })

  return category;
}