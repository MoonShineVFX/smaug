import type { NextApiRequest, NextApiResponse } from 'next'
import type { Asset } from '@prisma/client';
import {  RepresentationType, Prisma } from '@prisma/client';
import { prisma } from '../../../libs/server/prisma';
import util from '../../../utility/util';

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
    const { assetId } = req.query;
   
    const asset = await prisma.asset.findFirst(
        {
            where: {
                id: {
                    in: assetId
                },
            },
            ...selectField
        }
      )
    if (asset !== null) {
      const categories = await prisma.category.findMany({})

      let cate_dict = {}

      categories.forEach((element, index) => {
        
        //cate_dict[element[id]] = element;
      });

      const representations = await prisma.representation.findMany({where: {assetId: {in: assetId}}})

      const assetReturn = { 
              id: asset.id, 
              preview: "",
              name: asset.name,
              categoryList: "",
              updateAt: asset.updateAt,
              createAt: asset.createAt,
              creator: asset.creator.name,
              tags: asset.tags,
              renders: new Array(),
              downloads: new Array(),
          }

      representations.forEach((element, index) => {
        switch(element.type) { 
          case RepresentationType.PREVIEW: { 
            if (element.path !== null) assetReturn.preview = element.path; 
            break; 
          } 
          case RepresentationType.RENDER: { 
            const render = {
              id: element.id,
              name: element.name,
              path: element.path,
            }
            assetReturn.renders.push(render)
            break; 
          } 
          case RepresentationType.MODEL: { 
            const download = {
              id: element.id,
              name: element.name,
              format: element.format,
              fileSize: formatBytes(element.fileSize),
            }
            assetReturn.downloads.push(download)
            break; 
          } 
          default: { 
             break; 
          } 
        }
      });

      res.status(200).json(assetReturn)
    }
    res.status(404).json({ message: "Asset not found" })
  }