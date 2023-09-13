import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../client';


type TagReturnItem = {
  id: string
  name: string
}

export default async function handlerTag(req: NextApiRequest, res: NextApiResponse): Promise<void> {

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

async function handleGet(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    const tags = await prisma.tag.findMany({})
    const tagReturnItems: TagReturnItem[] = tags.map((tag) => {
      return { id: tag.id, name: tag.name }
    })
    res.status(200).json(tagReturnItems)

  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { name } = req.body
  try {
    const tag = await prisma.tag.create({
      data: {
        name: name
      }
    })
    res.status(200).json(tag)
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: "Internal Server Error" })
  }
}