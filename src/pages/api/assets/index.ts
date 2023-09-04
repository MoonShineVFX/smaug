import type { NextApiRequest, NextApiResponse } from 'next'
import type { Asset } from '@prisma/client';
import { RepresentationType, Prisma } from '@prisma/client';
import { prisma } from '../../../libs/server/prisma';
import { z } from 'zod';
import { AssetListItem } from '../../../libs/types';
import { settings } from '../../../libs/common';


export default async function handlerAsset(req: NextApiRequest, res: NextApiResponse): Promise<void> {

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
        path = `${settings.RESOURCE_URL}/${asset.representations[0].path}`;
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

async function _validCategoryId(categoryId: number | undefined): Promise<boolean> {
  if (categoryId === undefined) {
    return true;
  }
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  })
  if (category === null) {
    return false;
  }
  return true;
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<Asset[] | any>): Promise<void> {
  // create asset, the only required field is name, other fields are optional
  // if categoryId is not provided, categoryId will be set to 1 (No category)

  let { name, categoryId:cId, tags } = req.body
  if ( await _validCategoryId(cId)){
    return res.status(400).json({ message: "Invalid categoryId" })
  }
  
  const schema1 = z.object({
    name: z.string().min(1).max(255),
    categroryId: z.string().optional()
    tags: z.array(z.string()).optional()
  });

  prisma.asset.create({
    data: {
      name: name,
      categoryId: cId,
      createAt: new Date(),

    }
  )



}