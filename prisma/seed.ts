import { createId } from '@paralleldrive/cuid2';
import { PrismaClient, Role, UserType } from '@prisma/client'
import { faker } from '@faker-js/faker/locale/zh_TW'

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
    await prisma.user.createMany(
        { data: usersData }
    )

    const rootId = createId()
    // Create Root Category
    await prisma.category.create({
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
            parentId: categoriesLv1[Math.trunc(i/4)].id,
            name: faker.commerce.productName(),
            createAt: faker.date.past(),
        }
    })

    const categories = [...categoriesLv1, ...categoriesLv2]

    await prisma.category.createMany({data:categories})

    // Create 100 assets
    const assets = Array.from({ length: 100 }).map((_, i) => {
        return {
            id: createId(),
            name: faker.commerce.productName(),
            categoryId: categories[Math.trunc(i/5)].id,

            createAt: faker.date.past(),
        }
    })
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