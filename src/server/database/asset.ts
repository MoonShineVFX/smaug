import { Prisma, Asset } from "@prisma/client";
import prisma from '../../client';
import { fa } from "@faker-js/faker";


export async function get(assetId: string) {

  let asset = await prisma.asset.findUnique(
    {
      where: { id: assetId },
      include: {
        tags: true,
        creator: true,
        category: true,
        representations: true,
      }
    }
  )
  if (!asset) {
    return asset;
  }

  // remove password
  const { password, ...creatorWithoutPassword } = asset.creator;
  return { ...asset, creator: creatorWithoutPassword };
}

export async function listByCatrgory(categortId: number) {
  const assetListReturn = {
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