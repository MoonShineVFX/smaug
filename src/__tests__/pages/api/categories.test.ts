import { createMocks } from 'node-mocks-http';
import { PrismaClient } from '@prisma/client';
import handlerCategories from '../../../pages/api/categories'


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

    const { req, res } = createMocks(
      {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token.id}`
        },
        body: {
          parentId: null,
          name: "Test Category"
        }
      }
    )
    await handlerCategories(req, res);
    await prisma.category.delete({
      where: {
        name: "Test Category"
      }
    });
    expect(res._getStatusCode()).toBe(201);
    expect(res._getJSONData().name).toBe("Test Category");
  })
});

export { }