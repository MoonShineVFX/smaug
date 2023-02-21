import { createMocks } from 'node-mocks-http';
import { PrismaClient, Menu } from '@prisma/client';
import handlerTag from '../../../../pages/api/tags'

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

    await handlerTag(req, res);
    expect(res._getStatusCode()).toBe(200);
  })
})
