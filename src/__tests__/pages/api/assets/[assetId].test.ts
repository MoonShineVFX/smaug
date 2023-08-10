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

  test('return asset detail', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        cid: '3' // or any other valid ID
      }
    });

    await handlerAsset(req, res);
    expect(res._getStatusCode()).toBe(200);
    console.log(res);
  })
});


export { }