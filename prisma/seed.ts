import * as fs from 'fs'
import path from 'path'
import { faker } from '@faker-js/faker/locale/zh_TW'
import { PrismaClient, UserType, Category, Representation, Asset, Tag } from '@prisma/client'
import { createId } from '@paralleldrive/cuid2'
import { permission, rolesData } from '../src/libs/common'
import { hashPassword } from '../src/libs/server/auth'
import { defaultCategories, defaultAssets, defaultRepresentations, defaultTags, defaultMenus } from './defaultData'
import { sourceItems } from './defaultData'


// utitlties function
function replaceBankWithUnderscore(str: string) {
  return str.replace(/\s/g, '_')
}

function deleteFolderRecursive(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // 如果當前資料夾是 vault，就跳過
        if (curPath === path.join(folderPath, 'vault')) {
          return;
        }
        // 遞迴地刪除子資料夾
        deleteFolderRecursive(curPath);
      } else {
        // 刪除檔案
        fs.unlinkSync(curPath);
      }
    });
    // 刪除資料夾本身
    fs.rmdirSync(folderPath);
  }
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
    prisma.menu.deleteMany({})
  ])
  console.log('deleted all existing data')

  // 刪除所有檔案
  const storageRoot = process.env.STORAGE_ROOT
  deleteFolderRecursive(storageRoot as string)

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


  // create menu
  const menuData = defaultMenus.map((menu, i) => {
    return {
      name: menu.name,
      createAt: faker.date.past(),
      isDeleted: menu.isDeleted,
      isVisible: menu.isVisible,
      isProtected: menu.isProtected,
      sortOrder: menu.sortOrder,
    }
  })
  await prisma.menu.createMany({ data: menuData })
  console.log("menus created")

  // Create Root Category
  const rootId = createId()
  const rootCate = await prisma.category.create({
    data: {
      id: rootId,
      name: "Root",
      createAt: faker.date.past(),
    }
  })
  console.log("categort Root created")

  // Create 20 categories
  type categoryData = {
    id: string
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
      // iconName: cate.iconName,
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


  for (let item of sourceItems) {
    const itemId = assetsDict[item].id
    const itemName = replaceBankWithUnderscore(item)

    const sourceAssetFolder = `${sourceFolder}/${itemName}`
    const targetAssetFolder = `${storageRoot}/${itemId}`

    const repPreviewId = representationsDict[`${item} Preview`].id
    const repModelId = representationsDict[`${item} FBX`].id
    const RepTextureId = representationsDict[`${item} FBX texture`].id

    const sourceItemPreview = `${sourceAssetFolder}/${itemName}.png`
    const sourceItemModel = `${sourceAssetFolder}/${itemName}.zip`
    const sourceItemTexture = `${sourceAssetFolder}/${itemName}_texture.zip`

    const previewFile = `${itemId}/${repPreviewId}_preview.png`
    const modelFile = `${itemId}/${repModelId}_model.zip`
    const textureFile = `${itemId}/${RepTextureId}_texture.zip`

    const targetPreviewFile = `${storageRoot}/${previewFile}`
    const targetModelFile = `${storageRoot}/${modelFile}`
    const targetTextureFile = `${storageRoot}/${textureFile}`

    // update representation path

    await prisma.representation.update({
      where: { id: repPreviewId },
      data: { path: previewFile }
    })
    await prisma.representation.update({
      where: { id: repModelId },
      data: { path: modelFile }
    })
    await prisma.representation.update({
      where: { id: RepTextureId },
      data: { path: textureFile }
    })

    try {
      fs.mkdirSync(targetAssetFolder, { recursive: true })
      fs.copyFileSync(sourceItemPreview, targetPreviewFile)
      fs.copyFileSync(sourceItemModel, targetModelFile)
      fs.copyFileSync(sourceItemTexture, targetTextureFile)
    }
    catch (err) {
      console.log(err)
    }
  }
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