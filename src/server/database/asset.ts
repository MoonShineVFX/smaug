import { Prisma, RepresentationType } from "@prisma/client";
import prisma from '../../client';
import { AssetListItem, AssetCreateParams } from "../../libs/types";
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
  if (! asset) {
    return asset;
  }

  // remove password
  const { password, ...creatorWithoutPassword } = asset.creator;
  return { ...asset, creator: creatorWithoutPassword };
}

export async function listByCategory(categortId: number): Promise<AssetListItem[]> {
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
    return [] as AssetListItem[];
  }

  //update download path
  const assetReturnItems: AssetListItem[] = assets.map((asset) => {
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
  return assetReturnItems;
}

export async function create(payload: AssetCreateParams){
  const { name, categoryId, tags, creatorId } = payload;

  // get tags ids from tags name
  const tagsData = await prisma.tag.findMany({
    where: {
      name: {
        in: tags,
      },
    },
  });

  // using tagsData and tags to find out what tags is not exist in tagsData
  const tagsToCreate = tags.filter((tag) => {
    return !tagsData.some((tagData) => {
      return tagData.name === tag;
    });
  });

  // create tags
  const newTags = await prisma.tag.createMany({
    data: tagsToCreate.map((tag) => {
      return { name: tag };
    }),
    skipDuplicates: true,
  });

  // fetch tags again
  const allTagsData = await prisma.tag.findMany({
    where: {
      name: {
        in: tags,
      },
    },
  });

  const asset = await prisma.asset.create({
    data: {
      name: name,
      category: {
        connect: {
          id: categoryId,
        },
      },
      tags: {
        connect: allTagsData,
      },
      creator: {
        connect: {
          id: creatorId,
        },
      },
    },
  });
  const {isDeleted, ...assetWithoutIsDeleted} = asset;
  return assetWithoutIsDeleted;
  ;
}

export async function retire(assetId: string) {
  const asset = await prisma.asset.update({
    where: {
      id: assetId,
    },
    data: {
      isDeleted: true,
    },
  });
  return asset.id;
}