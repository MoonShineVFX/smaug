import type { NextApiRequest, NextApiResponse } from 'next'
import type { Asset } from '@prisma/client';
import { RepresentationType, RepresentationUsage } from '@prisma/client';
import prisma from '../../../client';
import util from '../../../utils/util';
import { AssetDetail } from '../../../libs/types';


const {
  formatBytes,
} = util;

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
  const selectField = {
    select: {
      id: true,
      name: true,
      categoryId: true,
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
      creator: {
        select: {
          name: true,
        },
      },
      updateAt: true,
      createAt: true,
    }
  }

  const assetId = typeof req.query.assetId === 'string' ? req.query.assetId : undefined;

  const asset = await prisma.asset.findUnique(
    {
      where: { id: assetId },
      ...selectField
    }
  )
  if (Boolean(asset)) {
    const categories = await prisma.category.findMany({ select: { id: true, parentId: true, name: true } })
    const representations = await prisma.representation.findMany({ where: { assetId: assetId } })

    type Category = {
      id: number,
      parentId: number | null
      name: string | null
    }

    const cate_dict: { [id: number]: Category; } = {};

    categories.forEach((element, index) => {
      cate_dict[element.id] = element;
    });

    const getCategoryList = (categoryId: number, categoryList: string | null): string => {
      const cate = cate_dict[categoryId]
      const newList = (categoryList == null) ? cate.name : `${cate.name}\\${categoryList}`

      if (cate !== undefined && cate.parentId !== null)
        return getCategoryList(cate.parentId, newList);
      else
        return newList == null ? "" : newList;
    };
    const categoryList = getCategoryList(asset!.categoryId, "")

    const assetReturn: AssetDetail = {
      id: asset!.id,
      preview: "",
      name: asset!.name,
      categoryList: categoryList,
      updateAt: asset!.updateAt,
      createAt: asset!.createAt,
      creator: asset!.creator.name,
      tags: asset!.tags,
      renders: new Array(),
      resources: new Array(),
    }

    representations.forEach((element, index) => {
      switch (element.usage) {
        case RepresentationUsage.THUMBNAIL: {
          if (element.path !== null) assetReturn.preview = element.path;
          break;
        }
        case RepresentationUsage.PREVIEW: {
          if (element.type === RepresentationType.RENDER) {
            const render = {
              id: element.id,
              name: element.name,
              path: element.path ? element.path : '',
            }
            assetReturn.renders.push(render)
            break;
          }
        }
        case RepresentationUsage.DOWNLOAD: {
          if (element.type !== RepresentationType.MODEL) break;
          const download = {
            id: element.id,
            name: element.name,
            format: element.format,
            fileSize: formatBytes(element.fileSize ? element.fileSize : 0),
          }
          assetReturn.resources.push(download)
          break;
        }
        default: {
          break;
        }
      }
    });

    res.status(200).json(assetReturn)
    return;
  }
  res.status(404).json({ message: "Asset not found" })
}
