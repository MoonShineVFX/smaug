import { createRouter } from 'next-connect';
import type { Category } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'
import { authenticateUser } from '../../../libs/server/auth';
import prisma from '../../../client';


const router = createRouter<NextApiRequest, NextApiResponse>()

router.use(authenticateUser);

router.get(async (req, res) => {
  console.log("into category api router.get")
  return await handleGet(req, res);
});
router.post(async (req, res) => {
  console.log("into category api router.post")
  return await handlePost(req, res);
});

router.all((req, res) => {
  console.log("into category api router.all")
  res.status(405).json({ message: "Method not allowed" })
});

// export default async function handlerCategories(req: NextApiRequest, res: NextApiResponse<Category | Category[] | any>): Promise<void> {

//   if (req.method === undefined) {
//     res.status(405).json({ message: "Method not allowed" })
//     return;
//   }
//   switch (req.method) {
//     case 'GET':
//       await handleGet(req, res);
//       break;
//     case 'POST':
//       await handlePost(req, res);
//       break;
//     default:
//       res.status(405).json({ message: "Method not allowed" })
//   }

// }

export default router.handler({
  onError: (err, req, res) => {
    res.status(500).json({ message: (err as Error).message })
  }
});


async function handleGet(req: NextApiRequest, res: NextApiResponse<Category[] | any>): Promise<void> {
  const { id, name } = req.query

  const returnField = {
    select: {
      id: true,
      name: true,
      parentId: true
    }
  }

  let queryFilter = {
    where: {
      AND: {} as { [key: string]: { equals: Boolean | string; } }
    }
  };

  queryFilter = {
    where: {
      AND: {
        isDeleted: { equals: false },
        isVisible: { equals: true },
      }
    }
  }

  let queryFunc: CallableFunction = prisma.category.findMany

  if (id) {
    queryFilter.where.AND = {
      ...queryFilter.where.AND,
      id: { equals: id as string },
    }
    queryFunc = prisma.category.findFirst
  }

  if (name) {
    queryFilter.where.AND = {
      ...queryFilter.where.AND,
      name: { equals: name as string },
    }
  }

  const categroies = await queryFunc(
    {
      ...queryFilter,
      ...returnField
    }
  )

  // get menu "category"
  const menuCategory = await prisma.menu.findUnique({
    where: {
      name: "Categories"
    },
  })

  res.status(200).json(categroies)
  return
}


interface NextApiRequestWithUser extends NextApiRequest {
  user: any // 你可以將 `any` 替換為你的 `User` 型別
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<Category[] | any>): Promise<void> {
  const requestWithUser = req as NextApiRequestWithUser;
  if (!requestWithUser.headers) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  if(requestWithUser.user === null) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const { name, parentId, menuId } = requestWithUser.body

  if (!name || !menuId) {
    res.status(400).json({ message: "Bad Request" })
    return
  }

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
        parentId,
        isDeleted: false,
        menuId: menuId,
        creator: requestWithUser.user.id,
      },
    }) as Category
    res.status(201).json(newCategory)
    return
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
    return
  }
}