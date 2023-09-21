import { Prisma, RepresentationType } from "@prisma/client";
import prisma from '../../client';
import { settings } from '../../libs/common';


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

export async function listByCategory(categortId: number) {
  const category = await prisma.category.findUnique({
    where: {
      id: categortId
    }
  })

  if (!category) {
    throw new Error("Category not found")
  }

  if (category.path === null) {
    throw new Error("Category Should be null")
  }

  const assets = await prisma.asset.findMany({
    where: {
      category: {
        path: {
          startsWith: category.path
        }
      },
      isDeleted: false
    },
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
  });

  if (assets.length === 0) {
    return assets;
  }

  //update download path
  const AssetReturnItems = assets.map((asset) => {
    let path: string;
    try {
      if (asset.representations[0].path === "") {
        path = "/no-image.jpg";
      }
      else {
        path = `${settings.RESOURCE_URL}/${asset.representations[0].path}`;
      }
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
  return assets;
}