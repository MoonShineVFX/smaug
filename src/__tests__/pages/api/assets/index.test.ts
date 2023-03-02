import { createMocks } from 'node-mocks-http';
import { PrismaClient, Asset } from '@prisma/client';
import handlerAsset from '../../../../pages/api/assets'


let prisma: PrismaClient;

beforeEach(async () => {
  prisma = new PrismaClient();
});

afterEach(async () => {
  await prisma.authToken.deleteMany({});
  await prisma.$disconnect();
})

describe('Assets API', () => {

  test('return assets list', async () => {
    const { req, res } = createMocks({ method: 'GET' });

    await handlerAsset(req, res);
    expect(res._getStatusCode()).toBe(200);
  })
});

export { }