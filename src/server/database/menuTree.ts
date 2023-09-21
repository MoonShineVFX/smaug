import { Category } from '@prisma/client';
import prisma from '../../client';
import { MenuWithCategoriesResponse, CategoryTree } from '../../libs/types';
import { getByMenuId as cateByMenuId } from './category';


export async function menuTree(id: string) {
  let menuId: string = id
  const menu = await prisma.menu.findUnique({
    where: {
      id: menuId
    },
  })
  if (!menu || menu.isDeleted || !menu.isVisible) {
    throw new Error("Menu Categories not found")
  }

  const categories = await cateByMenuId(menuId)


  // 把 category 整理成 id 為 key 值為 CategoryTree  的物件
  let categoryDict = {} as { [key: string]: CategoryTree }
  categories.forEach((category) => {
    categoryDict[category.id] = {
      id: category.id,
      name: category.name!,
      children: [],
    }
  })

  // 利用 categoryDict 整理出 categoryTree，去除掉 category 為 Root 那一層
  let categoryTree = [] as CategoryTree[]
  categories.forEach((category) => {
    if (category.parentId === null) {
      categoryTree.push(categoryDict[category.id])
    } else {
      categoryDict[category.parentId!].children.push(categoryDict[category.id])
    }

  })

  const menuWithCategories = {
    id: menu.id,
    name: menu.name,
    iconName: menu.iconName,
    children: categoryTree,
  }

  return menuWithCategories;
}





