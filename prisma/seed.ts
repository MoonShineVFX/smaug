import { faker } from '@faker-js/faker/locale/zh_TW'
import { PrismaClient, Role, UserType, Representation, RepresentationFormat, RepresentationType } from '@prisma/client'
import { createId } from '@paralleldrive/cuid2'
import { connect } from 'http2'

const prisma = new PrismaClient()
async function main() {
    //create Permission
    const permission = [
        ['CATEGORY_CREATE', '建立分類'],
        ['CATEGORY_UPDATE', '更新分類'],
        ['CATEGORY_DELETE', '刪除分類'],
        ['ASSET_CREATE', '建立資源'],
        ['ASSET_UPDATE', '更新資源'],
        ['ASSET_DELETE', '刪除資源'],
        ['ASSET_DOWNLOAD', '下載資源'],
        ['TAG_CREATE', '建立標籤'],
        ['TAG_UPDATE', '更新標籤'],
        ['TAG_DELETE', '刪除標籤'],
    ]

    // 刪除現有資料
    await prisma.$transaction([
        prisma.permission.deleteMany({}),
        prisma.representation.deleteMany({}),
        prisma.asset.deleteMany({}),
        prisma.category.deleteMany({}),
        prisma.user.deleteMany({})
    ])


    // 建立所有資料
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

    //create 50 user
    const usersData = Array.from({ length: 50 }).map((_, i) => {
        return {
            id: createId(),
            email: faker.internet.email(),
            name: faker.name.fullName(),
            role: i == 0 ? Role.ADMIN : (i < 40 ? Role.CREATOR : Role.USER),
            type: i == 0 ? UserType.BOT : UserType.HUMAN,
            createAt: faker.date.past(),
        }
    })

    const users = await prisma.user.createMany({ data: usersData })
    console.log(`users created`)


    // Create Root Category
    const rootId = createId()
    const create_root = prisma.category.create({
        data: {
            id: rootId,
            name: "Root",
            createAt: faker.date.past(),
        }
    })
    // Create 20 categories
    const categoriesLv1 = Array.from({ length: 4 }).map((_, i) => {
        return {
            id: createId(),
            parentId: rootId,
            name: faker.commerce.productName(),
            createAt: faker.date.past(),
        }
    })

    const categoriesLv2 = Array.from({ length: 16 }).map((_, i) => {
        return {
            id: createId(),
            parentId: categoriesLv1[Math.trunc(i / 4)].id,
            name: faker.commerce.productName(),
            createAt: faker.date.past(),
        }
    })

    const categories = [...categoriesLv1, ...categoriesLv2]
    const create_cate_tree = prisma.category.createMany({ data: categories })
    await prisma.$transaction([create_root, create_cate_tree])
    console.log(`categories created`)


    // Create 100 assets
    let creators = usersData.splice(0, 40)
    const assetsData = Array.from({ length: 100 }).map((_, i) => {
        let creator = creators[Math.floor(Math.random() * 40)]
        // console.log(`creator id: ${creator.id}`)
        let asset = {
            id: createId(),
            name: faker.commerce.productName(),
            categoryId: categories[Math.trunc(i / 5)].id,
            creatorId: creator.id,
            createAt: faker.date.past(),
        }
        // console.log(`asset: ${asset}`)
        return asset
    })
    await prisma.asset.createMany({ data: assetsData })
    console.log(`assets created`)


    // Create 50 representations ->preview
    await prisma.representation.createMany({
        data: Array.from({ length: 1 }).map((_, i) => {
            return {
                id: createId(),
                path: faker.image.imageUrl(320, 160),
                assetId: assetsData[i].id,
                format: RepresentationFormat.IMG,
                type: RepresentationType.PREVIEW,
                uploaderId: assetsData[i].creatorId,
                createAt: faker.date.past(),
                tags:{
                    create:[
                        {name: faker.word.noun()},
                        {name: faker.word.noun()}
                    ]
                }
            }
        })
    })
    console.log(`representations PREVIEW created`)


    // Create 25 representations ->model and texture
    for (let i = 0; i < 25; i++) {
        let texture = await prisma.representation.create({
            data: {
                id: createId(),
                path: faker.image.imageUrl(320, 160),
                assetId: assetsData[i].id,
                format: RepresentationFormat.IMG,
                type: RepresentationType.TEXTURE,
                uploaderId: assetsData[i].creatorId,
                createAt: faker.date.past()
            }
        })

        let asset = await prisma.representation.create({
            data: {
                id: createId(),
                path: faker.image.imageUrl(320, 160),
                assetId: assetsData[i].id,
                format: RepresentationFormat.MAX,
                type: RepresentationType.MODEL,
                uploaderId: assetsData[i].creatorId,
                createAt: faker.date.past(),
                linkTo:{connect:{id: texture.id}}
            }
        })
        console.log(`texture: ${texture.id} link by asset: ${asset.id}`)
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