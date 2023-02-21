import { createMocks } from 'node-mocks-http';
import { PrismaClient, Menu } from '@prisma/client';
import handlerMenu from '../../../../pages/api/menus'

let prisma: PrismaClient;

beforeEach(async () => {
  prisma = new PrismaClient();
})

afterEach(async () => {
  await prisma.authToken.deleteMany({});
  await prisma.$disconnect();
})

describe('Menus API', () => {

  test('return menus list', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await handlerMenu(req, res);
    expect(res._getStatusCode()).toBe(200);
  })
})
