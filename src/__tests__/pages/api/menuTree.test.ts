import { createMocks } from 'node-mocks-http';
import { PrismaClient } from '@prisma/client';
import handlerMenuTree from '../../../pages/api/menuTree'

let prisma: PrismaClient;


beforeEach(async () => {
  prisma = new PrismaClient();
});

afterEach(async () => {
  await prisma.authToken.deleteMany({});
  await prisma.$disconnect();
})

describe('Menu Tree API', () => {
  test('return categories list with menu as root', async () => {
    const homeMenu = await prisma.menu.findFirst({
      where: {
        name: { equals: 'Home' }
      }
    })

    const { req, res } = createMocks({ method: 'GET', query: { id: homeMenu?.id } });

    await handlerMenuTree(req, res);
    expect(res._getStatusCode()).toBe(200);
  })

})