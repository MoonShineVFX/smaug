import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../libs/server/prisma';
import { MenuListItem } from '../../../libs/types';


export default async function handlerMenu(req: NextApiRequest, res: NextApiResponse<MenuListItem | MenuListItem[] | any>): Promise<void> {

  if (req.method === undefined) {
    res.status(405).json({ message: "Method not allowed" })
    return;
  }
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    // case 'POST':
    //   await handlePost(req, res);
    //   break;
    default:
      res.status(405).json({ message: "Method not allowed" })
  }

}


function handleGet(req: NextApiRequest, res: NextApiResponse): void {
  const { id } = req.query

  const returnField = {
    id: true,
    name: true,
    sortOrder: true,
  }

  if (id) {
    prisma.menu.findUnique({
      where: {
        id: id as string
      },
      select: returnField
    }).then((menu) => {
      if (!menu) {
        res.status(404).json({ message: "Menu not found" })
        return
      }
      res.status(200).json(
        { id: menu.id, name: menu.name }
      )
    }).catch((err) => {
      res.status(500).json({ message: err.message })
    })
  } else {
    prisma.menu.findMany({
      select: returnField
    }).then((menus) => {
      if (menus.length === 0) {
        res.status(404).json({ message: "Menu not found" })
        return
      }
      res.status(200).json(menus.map((menu) => {
        return { id: menu.id, name: menu.name }
      }))
    }).catch((err) => {
      res.status(500).json({ message: err.message })
    })
  }
}