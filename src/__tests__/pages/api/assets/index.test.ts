import { createMocks } from 'node-mocks-http';
import { PrismaClient, Asset } from '@prisma/client';
import handlerAsset from '../../../../pages/api/assets'
import { prismaMock } from '../../../../singleton';

// let prisma: PrismaClient;

beforeEach(async () => {
  // prisma = new PrismaClient();
});

afterEach(async () => {
  await prismaMock.authToken.deleteMany({});
  await prismaMock.$disconnect();
})

describe('Assets API', () => {

  test('return assets list of a given category id', async () => {
    const { req, res } = createMocks({ method: 'GET', query:{cid: 3} });

    await handlerAsset(req, res);
    expect(res._getStatusCode()).toBe(200);
  })
});

export { }