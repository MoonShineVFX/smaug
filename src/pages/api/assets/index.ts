import type { NextApiRequest, NextApiResponse } from 'next'
import type { Asset } from '@prisma/client';
import { RepresentationType, Prisma } from '@prisma/client';
import { prisma } from '../../../libs/server/prisma';
import { AssetListItem } from '../../../libs/types';


export default async function handlerAsset(req: NextApiRequest, res: NextApiResponse): Promise<void> {

  if (req.method === undefined) {
    res.status(405).json({ message: "Method not allowed" })
    return;
  }
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    default:
      res.status(405).json({ message: "Method not allowed" })
  }

}

async function handleGet(req: NextApiRequest, res: NextApiResponse<Asset[] | any>): Promise<void> {

  const { cid } = req.query

  const targetCategory = await prisma.category.findUnique({
    where: {
      id: parseInt(cid as string, 10)
    },
    select: {
      path: true
    }
  });

  if (targetCategory === null) {
    res.status(404).json({ message: "Category path not found" })
    return;
  }

  let queryFilter: any

  if (cid) {
    queryFilter = {
      where: {
        category: {
          path: {
            startsWith: targetCategory.path
          }
        }
      }
    }
  }
  queryFilter.where = { ...queryFilter.where, isDeleted: false }

  const selectField = {
    select: {
      id: true,
      name: true,
      category: {
        select: {
          name: true,
          path: true
        }
      },
      representations: {
        where: {
          type: RepresentationType.PREVIEW,
        },
        orderBy: {
          createAt: Prisma.SortOrder.desc,
        },
        select: {
          path: true,
        },
      },
      updateAt: true,
      createAt: true,
    }
  }

  interface AssetQueryResult {
    id: string;
    name: string;
    category: {
      name: string | null;
      path: string;
    };
    representations: {
      path: string;
    }[];
    updateAt: Date | null;
    createAt: Date;
  };

  const assets = (await prisma.asset.findMany(
    {
      ...queryFilter,
      ...selectField
    }
  )) as unknown as AssetQueryResult[]
  console.log(assets);

  if (assets.length === 0) {
    res.status(200).json([]);
  }
  else {
    const AssetReturnItems: AssetListItem[] = assets.map((asset) => {
      let path;
      try {
        path = `${process.env['RESOURCE_URL']}/${asset.representations[0].path}`;
      } catch (error) {
        path = "/no-image.jpg";
      };

      return {
        id: asset.id,
        name: asset.name,
        preview: path,
        categoryName: asset.category.name,
        updateAt: asset.updateAt,
        createAt: asset.createAt,
      }
    })
    res.status(200).json(AssetReturnItems)
  }
}