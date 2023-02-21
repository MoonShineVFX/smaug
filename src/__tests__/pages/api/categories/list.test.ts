import { createMocks } from 'node-mocks-http';
import { PrismaClient } from '@prisma/client';
import handlerCategoryList from '../../../../pages/api/categories/list'

let prisma: PrismaClient;


beforeEach(async () => {
  prisma = new PrismaClient();
});

afterEach(async () => {
  await prisma.authToken.deleteMany({});
  await prisma.$disconnect();
})

describe('CategoriesList API', () => {
  test('return categories list with menu as root', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await handlerCategoryList(req, res);
    expect(res._getStatusCode()).toBe(200);
  })

})