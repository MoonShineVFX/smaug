import fs from 'fs'
import { faker } from '@faker-js/faker/locale/zh_TW'
import { PrismaClient, UserType, Category, Representation, Asset, Tag } from '@prisma/client'
import { createId } from '@paralleldrive/cuid2'
import { permission, rolesData } from '../src/libs/common'
import { hashPassword } from '../src/libs/server/auth'
import { defaultCategories, defaultAssets, defaultRepresentations, defaultTags } from './defaultData'
import { sourceItems } from './defaultData'


// utitlties function
function replaceBankWithUnderscore(str: string) {
  return str.replace(/\s/g, '_')
}

const prisma = new PrismaClient()
async function main() {

  // 刪除現有資料

  await prisma.$transaction([
    prisma.representation.deleteMany({}),
    prisma.asset.deleteMany({}),
    prisma.tag.deleteMany({}),
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

  let userAdmin = await prisma.user.create({
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
  const rootCate = await prisma.category.create({
    data: {
      id: rootId,
      name: "Root",
      createAt: faker.date.past(),
    }
  })
  console.log(`categort Root created`)

  // Create 20 categories
  type categoryData = {
    id: string
    iconName: string | null
    name: string | null
    parent: string
    parentId: string
    createAt: Date
    isDeleted: boolean
    isVisible: boolean
    updateAt: Date | null
  }

  const categoriesData: categoryData[] = defaultCategories.map((cate, i) => {
    // console.log(`convert category: ${cate.name} to categoryData`)
    return {
      id: createId(),
      iconName: "ViewModule",
      name: cate.name as string,
      parent: cate.parent,
      parentId: '',
      createAt: faker.date.past(),
      isDeleted: false,
      isVisible: true,
      updateAt: null
    }
  })

  const categoryDict: { [key: string]: categoryData } = {}
  categoryDict['Root'] = {
    id: rootCate.id,
    iconName: rootCate.iconName,
    name: rootCate.name,
    parent: '',
    parentId: '',
    createAt: rootCate.createAt,
    isDeleted: rootCate.isDeleted,
    isVisible: rootCate.isVisible,
    updateAt: rootCate.updateAt
  }

  for (let category of categoriesData) {
    categoryDict[category.name as string] = category
  }

  //update parentId
  for (let categoryKey in categoryDict) {
    const category = categoryDict[categoryKey]
    if (category.parent !== '') {
      category.parentId = categoryDict[category.parent].id
    }
  }

  const categories: Category[] = categoriesData.map((cate) => {
    return {
      id: cate.id,
      iconName: cate.iconName,
      name: cate.name as string,
      createAt: cate.createAt,
      isDeleted: cate.isDeleted,
      isVisible: cate.isVisible,
      parentId: cate.parentId,
      updateAt: null
    }
  })

  await prisma.category.createMany({ data: categories })
  console.log(`categories created`)

  // create assets
  const assetsData: Asset[] = defaultAssets.map((asset, i) => {
    return {
      id: createId(),
      name: asset.name,
      categoryId: categoryDict[asset.category].id,
      creatorId: userAdmin.id,
      createAt: faker.date.past(),
      isDeleted: false,
      updateAt: null
    }
  })

  const assetsDict: { [key: string]: Asset } = {}
  for (let asset of assetsData) {
    assetsDict[asset.name as string] = asset
  }
  await prisma.asset.createMany({ data: assetsData })

  // create tags
  const tagsData: Tag[] = defaultTags.map((tag, i) => {
    return {
      id: createId(),
      name: tag.name,
      assets: {
        connect: tag.assets.map((asset) => {
          return { id: assetsDict[asset].id }
        }),
      },
      createAt: faker.date.past(),
      updateAt: null
    }
  })

  for (let tagData of tagsData) {
    await prisma.tag.create({ data: tagData })
  }
  console.log(`tags created`)

  // create representations
  const representationsData: Representation[] = defaultRepresentations.map((rep, i) => {
    return {
      id: createId(),
      name: rep.name,
      format: rep.format,
      type: rep.type,
      assetId: assetsDict[rep.asset].id,
      path: "",
      uploaderId: userAdmin.id,
      createAt: faker.date.past(),
      updateAt: null,
      textureId: null,
    }
  }
  )

  const representationsDict: { [key: string]: Representation } = {}
  for (let rep of representationsData) {
    representationsDict[rep.name as string] = rep
  }
  // update representations relation
  for (let defaultRep of defaultRepresentations) {
    const rep = representationsDict[defaultRep.name]
    if (defaultRep.texture) {
      rep.textureId = representationsDict[defaultRep.texture].id
    }
  }

  await prisma.representation.createMany({ data: representationsData })
  console.log(`representations created`)


  // 操作檔案
  const sourceFolder = process.env.SOURCE_DATA_FOLDER
  // const dragonLair = process.env.DRAGON_LAIR
  // 其實我很想叫這個名字，但想想為了不要讓人誤會，還是改成 STORAGE_ROOT 這種無聊的名字吧

  const storageRoot = process.env.STORAGE_ROOT
  for (let item of sourceItems) {
    const itemId = assetsDict[item].id
    const itemName = replaceBankWithUnderscore(item)

    const sourceAssetFolder = `${sourceFolder}/${itemName}`
    const targetAssetFolder = `${storageRoot}/${itemId}`

    const sourceItemPreview = `${sourceAssetFolder}/${itemName}.png`
    const sourceItemModel = `${sourceAssetFolder}/${itemName}.zip`
    const sourceItemTexture = `${sourceAssetFolder}/${itemName}_texture.zip`

    const targetPreviewFile = `${targetAssetFolder}/${itemId}_preview.png`
    const targetModelFile = `${targetAssetFolder}/${itemId}_model.zip`
    const targetTextureFile = `${targetAssetFolder}/${itemId}_texture.zip`

    try {
      fs.copyFileSync(sourceItemPreview, targetPreviewFile)
      fs.copyFileSync(sourceItemModel, targetModelFile)
      fs.copyFileSync(sourceItemTexture, targetTextureFile)
    }
    catch (err) {
      console.log(err)
    }
  }


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