import { createMocks } from 'node-mocks-http';
import { faker } from '@faker-js/faker/locale/zh_TW';
// import { createId } from '@paralleldrive/cuid2';
import { PrismaClient, UserType } from '@prisma/client';
import { permission, rolesData } from '../../../libs/common';
import handlerCategories from '../../../pages/api/categories';


let prisma: PrismaClient;
beforeEach(async () => {
    prisma = new PrismaClient();

    await prisma.permission.createMany({
        data: permission.map((arg) => {
            return {
                codeName: arg[0],
                name: arg[1],
                createAt: faker.date.past(),
            }
        })
    })

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

    // 建立 Admin User
    const roleAdmin = await prisma.role.findFirstOrThrow({
        where: { name: { contains: 'Admin' } },
        select: { id: true }
    })
    await prisma.user.create({
        data: {
            name: 'Admin',
            email: 'admin@moonshine.tw',
            roleId: roleAdmin.id,
            type: UserType.BOT,
        }
    })

    //建立 root category
    await prisma.category.create({
        data: {
            name: 'Root',
            createAt: faker.date.past(),
        }
    })
});

afterEach(async () => {
    await prisma.category.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.permission.deleteMany({})
    await prisma.role.deleteMany({})
    await prisma.$disconnect();
})

describe('Categories API', () => {

    test('return categories list', async () => {
        const { req, res } = createMocks({ method: 'GET' });

        await handlerCategories(req, res);
        expect(res._getStatusCode()).toBe(200);
        console.log(res.json())
    })

    test('return a category by name', async () => {
        const { req, res } = createMocks(
            { method: 'GET', query: { name: "Root" } }
        )
        await handlerCategories(req, res);
        const rootCate = res._getJSONData()[0]
        expect(rootCate.name).toBe("Root")
    })

    test('should be able to create a category when caller authenticated', async () => {
        const { req, res } = createMocks(
            { 
                method: 'POST',
                headers:{
                    authorization: "!1"
                },
                body: { name: "Test Category" } }
        )
        await handlerCategories(req, res);
        expect(res._getStatusCode()).toBe(200);
        expect(res._getJSONData().name).toBe("Test Category")
    })
});

export { }