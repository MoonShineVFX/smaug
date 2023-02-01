import { createMocks } from 'node-mocks-http';
// import { createId } from '@paralleldrive/cuid2';
import { PrismaClient } from '@prisma/client';
import handlerCategories from '../../../pages/api/categories';


let prisma: PrismaClient;

beforeEach(async () => {
  prisma = new PrismaClient();
});

afterEach(async () => {
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
    const rootCate = res._getJSONData()[0]
    expect(rootCate.name).toBe("Root")
  })

  // test('should be able to create a category when caller authenticated', async () => {
  //   const { req, res } = createMocks(
  //     {
  //       method: 'POST',
  //       headers: {
  //         authorization: "!1"
  //       },
  //       body: { name: "Test Category" }
  //     }
  //   )
  //   await handlerCategories(req, res);
  //   expect(res._getStatusCode()).toBe(200);
  //   expect(res._getJSONData().name).toBe("Test Category")
  // })
});

export { }