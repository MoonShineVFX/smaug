import { Prisma, Asset } from "@prisma/client";
import prisma from '../../client';


export async function get(assetId: string): Promise<Asset | null> {

  const asset = await prisma.asset.findUnique(
    {
      where: { id: assetId },
    }
  )

  return asset;
}

export async function listByCatrgory(categortId: number): Promise<Asset[]> {
  const assetListReturn: Prisma.AssetSelect = {
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

  const assets = await prisma.asset.findMany({
    where: {
      categoryId: categortId
    },
    select: assetListReturn
  });

  return assets;
}