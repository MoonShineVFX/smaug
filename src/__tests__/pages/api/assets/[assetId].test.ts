import { createMocks } from 'node-mocks-http';
import { PrismaClient, Asset } from '@prisma/client';
import { prismaMock } from '../../../../singleton';
import { mockReset } from 'jest-mock-extended';
import { handleAsset } from '../../../../pages/api/assets'


let prisma: PrismaClient;

beforeEach(async () => {
  mockReset(prismaMock);
});

afterEach(async () => {
  // pass
})

describe('Assets API', () => {

  test('return asset detail', async () => {
    
    prismaMock.asset.findMany.mockResolvedValue([]);
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        cid: '3' // or any other valid ID
      }
    });

    const mockHandleAsset = handleAsset(prismaMock);
    await mockHandleAsset(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    console.log(res);
  })
});


export { }