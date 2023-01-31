import type { NextApiRequest, NextApiResponse } from 'next'
import type { Category } from '@prisma/client';
import { prisma } from '../../libs/server/prisma';

const ALLOW_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export default async function handlerCategories(req: NextApiRequest, res: NextApiResponse<Category[] | any>): Promise<void> {
    // return categories and it's assets by category id
    if (req.method === undefined) {
        res.status(405).json({ message: "Method not allowed" })
        return;
    }
    if (!ALLOW_METHODS.includes(req.method)) {
        res.status(405).json({ message: "Method not allowed" })
        return;
    }
    const { id, name } = req.query

    const returnField = {
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    assets: true,
                }
            },
            children: {
                where: {
                    isDeleted: false,
                },
                select: {
                    id: true,
                    name: true,
                    _count: {
                        select: {
                            assets: true,
                        }
                    }
                }
            }
        }
    }

    let queryFilter = {
        where: {
            AND: {} as { [key: string]: { equals: any; } }
        }
    };

    queryFilter = {
        where: {
            AND: {
                isDeleted: { equals: false },
            }
        }
    }

    let queryFunc: CallableFunction = prisma.category.findMany

    if (id) {
        queryFilter.where.AND = {
            ...queryFilter.where.AND,
            id: { equals: id as string },
        }
        queryFunc = prisma.category.findFirst
    }

    if (name) {
        queryFilter.where.AND = {
            ...queryFilter.where.AND,
            name: { equals: name as string },
        }
    }

    const categroies = await queryFunc(
        {
            ...queryFilter,
            ...returnField
        }
    )
    res.status(200).json(categroies)
    return
}

