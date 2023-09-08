import { createMocks } from 'node-mocks-http';
import { Asset } from '@prisma/client';
import handleAsset from '../../../../pages/api/assets'
import { prismaMock } from '../../../../singleton';
import { mockReset } from 'jest-mock-extended';
import { AssetListItem } from '../../../../libs/types';

// let prisma: PrismaClient;

beforeEach(async () => {
  mockReset(prismaMock);
});

afterEach(async () => {
  // await prismaMock.authToken.deleteMany({});
  // await prismaMock.$disconnect();
})

describe('Assets API', () => {

  test('return assets list of a given category id', async () => {
    // 預設回應模擬
    const mockAssetListReturn: AssetListItem[] = [
      {
        id: 'asset-1',
        name: "Test Asset",
        preview: "https://picsum.photos/200/300",
        createAt: new Date(2023, 9, 2),
        categoryName: "Test Category",
        updateAt: null,
      }]

    prismaMock.asset.findMany.mockResolvedValue(mockAssetListReturn);

    const { req, res } = createMocks({ method: 'GET', query: { cid: 3 } });

    await handleAsset(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(mockAssetListReturn);  // 請根據你的預期回應做調整
  });

  test('create Asset', async () => {
    const adminUser = await prismaMock.user.findFirst({
      where: {
        account: "admin"
      }
    })
    const token = await prismaMock.authToken.create({
      data: {
        user: { connect: { id: adminUser!.id } }
      }
    })
    const { req, res } = createMocks({ method: 'POST', body: { name: 'test', categoryId: 3 } });

    await handleAsset(req, res);
    expect(res._getStatusCode()).toBe(200);
  })
});

export { }