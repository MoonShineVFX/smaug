
import prisma from '../../client';
import { Prisma } from '@prisma/client';
import { MenuListItem } from '../../libs/types';


const menuReturnField: Prisma.MenuSelect = {
  id: true,
  name: true,
  sortOrder: true,
}


export async function get() {
  const menus = await prisma.menu.findMany({
    select: menuReturnField
  })

  if (menus.length === 0) {
    throw new Error("Menu not found")
  } else {
    return (menus.map((menu) => {
      return { id: menu.id, name: menu.name }
    }))
  }
}


export async function detail(id: string) {
  //   取得 menu detail, 但目前沒有用到 XD

  try {
    const menu = await prisma.menu.findUnique({
      where: {
        id: id as string
      },
      select: menuReturnField
    })
    if (!menu) {
      throw new Error("Menu not found")
    } else {
      return { id: menu.id, name: menu.name }
    }

  } catch (err: any) {
    throw new Error(err)
  }
}


