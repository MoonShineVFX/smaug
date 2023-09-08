import { createMocks } from 'node-mocks-http';
import { Asset } from '@prisma/client';
import { handleAsset } from '../../../../pages/api/assets'
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
    const mockAssetFindMany = [{
      id: "asset-1",
      name: "Tree 1",
      categoryId: 3,
      category: {
        path: "3d/Trees",
        name: "Trees",
      },
      representations: [{
        path: "https://midea-server/asset-1/preview-1.jpg",
      }],
      creatorId: "admin",
      createAt: new Date(2019, 1, 1),
      updateAt: null,
      isDeleted: false,
    }];

    prismaMock.asset.findMany.mockResolvedValue(mockAssetFindMany);

    const mockedHandleAsset = handleAsset(prismaMock);
    const { req, res } = createMocks({ method: 'GET', query: { cid: 3 } });

    mockedHandleAsset.run(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(mockAssetFindMany);  // 請根據你的預期回應做調整
  });

  test('create Asset', async () => {
    prismaMock.authToken.findMany.mockReturnValue([]);
    const { req, res } = createMocks({ method: 'POST', headers: {authorization:"bearar 123456"}, body: { name: 'test', categoryId: 3 } });
    const mockedHandleAsset = handleAsset(prismaMock);
    handleAsset(req, res);
    expect(res._getStatusCode()).toBe(200);
  })
});

export { }