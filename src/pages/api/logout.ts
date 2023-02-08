import { prisma } from '../../libs/server/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

// 清掉 token
export default async function handlerLogout(
  req: NextApiRequest,
  res: NextApiResponse): Promise<void> {
  // clear token
  try {
    await prisma.authToken.delete({
      where: {
        id: req.headers.authorization
      },
    })
    res.status(200).json({ message: 'see you' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'server error' })
  }
}

