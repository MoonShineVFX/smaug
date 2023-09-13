import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from '../../libs/server/auth'
import prisma from '../../client'

// 清掉 token
export default async function handlerLogout(
  req: NextApiRequest,
  res: NextApiResponse): Promise<void> {
  // clear 

  const token = getToken(req)
  try {
    await prisma.authToken.delete({
      where: {
        id: token
      },
    })
    res.status(200).json({ message: 'see you' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'server error' })
  }
}

