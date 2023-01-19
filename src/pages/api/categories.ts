import type { NextApiRequest, NextApiResponse } from 'next'
import type { Category } from '@prisma/client';

export default function handlerCategories(req: NextApiRequest, resp: NextApiResponse<Category[] | any>): void {
    // return categories and it's assets by category id
    if (req.method != 'GET') {
        resp.status(405).json({ message: "Method not allowed" })
        return;
    }

    resp.status(200).json({
        id: 1,
        name: "模型啦",
        createAt: new Date(),
        updateAt: new Date(),
        assets: [
            { id: 1, name: "模型1", url: "https://moonshine.com/assets/1" },
        ]
    })
}
