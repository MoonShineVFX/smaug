import { faker } from '@faker-js/faker/locale/zh_TW'
import { PrismaClient, Role, UserType, RepresentationFormat, RepresentationType } from '@prisma/client'
import { createId } from '@paralleldrive/cuid2'
import { permission, rolesData } from '../src/libs/common'
import { hashPassword } from '../src/libs/server/auth'


const prisma = new PrismaClient()
async function main() {

  // 刪除現有資料
  await prisma.$transaction([
    // prisma.representation.deleteMany({}),
    // prisma.asset.deleteMany({}),
    prisma.category.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.permission.deleteMany({}),
    prisma.role.deleteMany({}),
  ])
  console.log('deleted all existing data')

  // 建立所有初始資料
  // 建立權限
  await prisma.permission.createMany({
    data: permission.map((arg) => {
      return {
        codeName: arg[0],
        name: arg[1],
        createAt: faker.date.past(),
      }
    })
  })
  console.log(`permissions created`)


  // 建立 Role
  const rolePermissions = rolesData.map((roleItem) => {
    return {
      name: roleItem.roleName,
      permissions: {
        connect: roleItem.permissions.map((permissionItem) => {
          return { codeName: permissionItem }
        })
      }
    }
  })
  for (let rolePermission of rolePermissions) {
    await prisma.role.create({ data: rolePermission })
  }
  console.log('roles created')


  //create admin
  const roleAdmin = await prisma.role.findFirstOrThrow({
    where: { name: { contains: 'Admin' } },
    select: { id: true }
  })

  await prisma.user.create({
    data: {
      name: '管理員',
      account: 'admin',
      password: await hashPassword('admin'),
      email: 'admin@moonshine.tw',
      roleId: roleAdmin.id,
      type: UserType.BOT,
    }
  })
  console.log(`users "Admin" created`)


  // Create Root Category
  const rootId = createId()
  const create_root = await prisma.category.create({
    data: {
      id: rootId,
      name: "Root",
      createAt: faker.date.past(),
    }
  })
  console.log(`categort Root created`)

  // Create 20 categories
  // const categoriesLv1 = Array.from({ length: 4 }).map((_, i) => {
  //   return {
  //     id: createId(),
  //     parentId: rootId,
  //     name: faker.commerce.productName(),
  //     createAt: faker.date.past(),
  //   }
  // })

  // const categoriesLv2 = Array.from({ length: 16 }).map((_, i) => {
  //   return {
  //     id: createId(),
  //     parentId: categoriesLv1[Math.trunc(i / 4)].id,
  //     name: faker.commerce.productName(),
  //     createAt: faker.date.past(),
  //   }
  // })

  // const categories = [...categoriesLv1, ...categoriesLv2]
  // const create_cate_tree = prisma.category.createMany({ data: categories })
  // await prisma.$transaction([create_root, create_cate_tree])
  // console.log(`categories created`)

  // Create 10 tag
  // await prisma.tag.createMany({
  //   data: Array.from({ length: 10 }).map((_, i) => {
  //     return {
  //       name: faker.word.noun(),
  //       createAt: faker.date.past(),
  //     }
  //   })
  // })
  // console.log(`tags created`)


  // Create 100 assets
  // let creators = usersData.splice(0, 40)
  // const tags = await prisma.tag.findMany()
  // for (let i = 0; i < 100; i++) {
  //   let creator = creators[Math.floor(Math.random() * 40)]
  //   await prisma.asset.create({
  //     data: {
  //       name: faker.commerce.productName(),
  //       categoryId: categories[Math.trunc(i / 5)].id,
  //       creatorId: creator.id,
  //       createAt: faker.date.past(),
  //       tags: {
  //         connect: [
  //           { id: tags[Math.floor(Math.random() * 10)].id },
  //         ]
  //       }
  //     }
  //   })
  // }
  // console.log(`assets created`)


  // Create 50 representations ->preview
  // const assets = await prisma.asset.findMany()
  // await prisma.representation.createMany({
  //   data: Array.from({ length: 1 }).map((_, i) => {
  //     return {
  //       id: createId(),
  //       path: faker.image.imageUrl(320, 160),
  //       assetId: assets[i].id,
  //       format: RepresentationFormat.IMG,
  //       type: RepresentationType.PREVIEW,
  //       uploaderId: assets[i].creatorId,
  //       createAt: faker.date.past(),
  //     }
  //   })
  // })
  // console.log(`representations PREVIEW created`)


  // Create 25 representations ->model and texture
  // for (let i = 0; i < 25; i++) {
  //   let texture = await prisma.representation.create({
  //     data: {
  //       id: createId(),
  //       path: faker.image.imageUrl(320, 160),
  //       assetId: assets[i].id,
  //       format: RepresentationFormat.IMG,
  //       type: RepresentationType.TEXTURE,
  //       uploaderId: assets[i].creatorId,
  //       createAt: faker.date.past()
  //     }
  //   })

  //   await prisma.representation.create({
  //     data: {
  //       id: createId(),
  //       path: faker.image.imageUrl(320, 160),
  //       assetId: assets[i].id,
  //       format: RepresentationFormat.MAX,
  //       type: RepresentationType.MODEL,
  //       uploaderId: assets[i].creatorId,
  //       createAt: faker.date.past(),
  //       linkTo: { connect: { id: texture.id } }
  //     }
  //   })
  // }
  // console.log(`representations MODEL and TEXTURE created`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })