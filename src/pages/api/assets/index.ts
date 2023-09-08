import type { NextApiRequest, NextApiResponse } from 'next'
import { createRouter } from 'next-connect';
import type { Asset, PrismaClient } from '@prisma/client';
import { RepresentationType, Prisma } from '@prisma/client';
import { authenticateUser } from '../../../libs/server/auth';
import { prisma } from '../../../libs/server/prisma';
import { AssetListItem } from '../../../libs/types';
import { settings } from '../../../libs/common';
import { assetCreateSchema } from '../../../libs/server/apiSchema';


// Make prisma client is dependency injection
export const handleAsset = (prismaInst: PrismaClient) => {
  const router = createRouter<NextApiRequest, NextApiResponse>()
  router.use(authenticateUser);
  router.get(async (req, res) => {
    return await handleGet(req, res);
  });
  router.post(async (req, res) => {
    return await handlePost(req, res);
  });
  router.all((req, res) => {
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

  async function handlePost(req: NextApiRequest, res: NextApiResponse<Asset[] | any>): Promise<void> {
    // create asset, the only required field is name, other fields are optional
    // if categoryId is not provided, categoryId will be set to 1 (in schema)

    const valied_body = assetCreateSchema.parse(req.body);
    const { name, categoryId, tags } = valied_body;

    // 驗證 tags 中所有的 UUID 都存在於資料庫中
    if (tags) {
      for (const tagId of tags) {
        const exists = await prismaInst.tag.findUnique({ where: { id: tagId } });
        if (!exists) {
          return res.status(400).json({ error: `Tag with ID ${tagId} does not exist` });
        }
      }
    }

    // 從 authrization header 中取得 token 來驗證使用者身份
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
    //用 token 查詢 authToken 資料表，找到對應的使用者
    const authToken = await prismaInst.authToken.findUnique({
      where: { id: token },
      include: { user: true },
    });

    if (!authToken) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const assetCreateData: Prisma.AssetCreateInput = {
      name: name,
      category: {
        connect: { id: categoryId }
      },
      createAt: new Date(),
      creator: { connect: { id: authToken.user.id } }, // Consider fetching this from a session or a JWT for an authenticated user
      tags: tags ? { connect: tags.map(tagId => ({ id: tagId })) } : undefined,
    };

    const createdAsset = await prismaInst.asset.create({
      data: assetCreateData
    });

    res.status(200).json(createdAsset);
  }
  return router;
}

export default handleAsset(prisma).handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: (err as Error).message })
  }
});

// for warning "API resolved without sending a response ..."
export const config = {
  api: {
    externalResolver: true,
  },
}