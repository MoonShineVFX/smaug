import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect';
import type { Asset } from '@prisma/client';
import { RepresentationType, Prisma, RepresentationUsage } from '@prisma/client';
import { authenticateUser } from '../../../libs/server/auth';
import prisma from '../../../client';
import { AssetListItem } from '../../../libs/types';
import { settings } from '../../../libs/common';
import { assetCreateSchema } from '../../../libs/apiSchema';


// for warning "API resolved without sending a response ..."
export const config = {
  api: {
    externalResolver: true,
  },
}

// Make prisma client is dependency injection
const router = createRouter<NextApiRequest, NextApiResponse>()
router.use(authenticateUser);
router.get(async (req, res) => {
  console.log("into router.get")
  return await handleGet(req, res);
});
router.post(async (req, res) => {
  console.log("into router.post")
  return await handlePost(req, res);
});
router.all((req, res) => {
  console.log("into router.all")
  res.status(405).json({ message: "Method not allowed" })
});

// method implementation
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
          type: RepresentationUsage.THUMBNAIL,
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
  // console.log(assets);

  if (assets.length === 0) {
    res.status(200).json([]);
  }
  else {
    const AssetReturnItems: AssetListItem[] = assets.map((asset) => {
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
    res.status(200).json(AssetReturnItems)
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<Asset[] | any>): Promise<void> {
  // create asset, the only required field is name, other fields are optional
  // if categoryId is not provided, categoryId will be set to 1 (in schema)

  // user authentication by middleware authenticateUser
  if ((req as any).user === null) {
    res.status(401).json({ message: "Unauthorized" })
    return;
  }

  const currentUser = (req as any).user;
  console.log(`current user is: ${currentUser.name}`)
  console.log(`req.body = ${req.body}`)
  let valied_body: any
  try {
    valied_body = assetCreateSchema.parse(req.body);
  }
  catch (error) {
    console.log(error)
    res.status(400).json({ message: "Bad Request" })
    return
  }

  const { name, categoryId, tags } = valied_body;

  // 驗證 tags 中所有的 UUID 都存在於資料庫中
  if (tags) {
    for (const tagId of tags) {
      const exists = await prisma.tag.findUnique({ where: { id: tagId } });
      if (!exists) {
        return res.status(400).json({ error: `Tag with ID ${tagId} does not exist` });
      }
    }
  }

  const assetCreateData: Prisma.AssetCreateInput = {
    name: name,
    category: {
      connect: { id: categoryId }
    },
    createAt: new Date(),
    creator: { connect: { id: currentUser.id } }, // Consider fetching this from a session or a JWT for an authenticated user
    tags: tags ? { connect: tags.map((tagId: string) => ({ id: tagId })) } : undefined,
  };

  const createdAsset = await prisma.asset.create({
    data: assetCreateData,
    include:{ category: true, creator: true}
  });

  const {isDeleted, ...cleanAsset} = createdAsset;
  // remove isDeleted field from createdAsset
  
  try { res.status(200).json(cleanAsset); }
  catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
  console.log("exist post: Asset created successfully");
  return;
}


export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: (err as Error).message })
  }
});
