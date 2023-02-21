import { createMocks } from 'node-mocks-http';
import { PrismaClient, Category } from '@prisma/client';
import handlerCategories from '../../../../pages/api/categories'


let prisma: PrismaClient;

beforeEach(async () => {
  prisma = new PrismaClient();
});

afterEach(async () => {
  await prisma.authToken.deleteMany({});
  await prisma.$disconnect();
})

describe('Categories API', () => {

  test('return categories list', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await handlerCategories(req, res);
    expect(res._getStatusCode()).toBe(200);
  })

  test('return a category by name', async () => {
    const { req, res } = createMocks(
      { method: 'GET', query: { name: "Root" } }
    )
    await handlerCategories(req, res);
    const rootCate = res._getJSONData()[0];
    expect(rootCate.name).toBe("Root");
  })

  test('should be able to create a category when caller authenticated', async () => {
    // fake a token
    const adminUser = await prisma.user.findFirst({
      where: {
        account: "admin"
      }
    })
    const token = await prisma.authToken.create({
      data: {
        user: { connect: { id: adminUser!.id } }
      }
    })

    // get root category
    const rootCate = await prisma.category.findFirst({
      where: {
        name: { equals: "Root" }
      }
    }) as Category

    const { req, res } = createMocks(
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token.id}`
        },
        body: {
          parentId: rootCate.id,
          name: "Test Category"
        }
      }
    )

    await handlerCategories(req, res)
    expect(res._getStatusCode()).toBe(201)

    const newCate = res._getJSONData()
    const newCateId: string = newCate.id
    const newCateName: string = newCate.name
    await prisma.category.delete({
      where: {
        id: newCateId
      }
    });

    expect(newCateName).toBe("Test Category");
  })
});

export { }