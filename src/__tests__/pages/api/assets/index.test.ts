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
    const mockAssetFindMany = [
      {
        id: "ccl3yzdcqmqqhvgy0eh9tasq",
        name: "Hat",
        representations: [{ path: "/no-image.jpg" },],
        category: {
          name: "Accessories",
          path: "2/1"
        },
        updateAt: null,
        createAt: "2023-02-25T20:06:15.263Z",
        isDeleted: false,
        creatorId: "admin"
      },
      {
        id: "g0hb02576av7sy9vrg89cd6q",
        name: "Fish 001",
        repersentations: [{ path: "http://127.0.0.1:8088/vault/g0hb02576av7sy9vrg89cd6q/eszi8mubh7y0linfqnor6jdm_preview.png", },],
        category: {
          name: "Fish",
          path: "2/1"
        },
        updateAt: null,
        createAt: "2023-03-06T09:06:05.325Z",
        isDeleted: false,
        creatorId: "admin"
      },]

    const excpet_result = [
      {
        id: "ccl3yzdcqmqqhvgy0eh9tasq",
        name: "Hat",
        preview: "/no-image.jpg",
        categoryName: "Accessories",
        updateAt: null,
        createAt: "2023-02-25T20:06:15.263Z",
      },
      {
        id: "g0hb02576av7sy9vrg89cd6q",
        name: "Fish 001",
        preview: "http://127.0.0.1:8088/vault/g0hb02576av7sy9vrg89cd6q/eszi8mubh7y0linfqnor6jdm_preview.png",
        categoryName: "Fish",
        updateAt: null,
        createAt: "2023-03-06T09:06:05.325Z"
      },
    ]
    prismaMock.category.findUnique.mockResolvedValue({ path: "2/1"} as any);
    prismaMock.asset.findMany.mockResolvedValue(mockAssetFindMany as any);

    const mockedHandleAsset = handleAsset(prismaMock);
    const { req, res } = createMocks({ method: 'GET', query: { cid: 3 } });

    await mockedHandleAsset(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getData()).toEqual(excpet_result);  // 請根據你的預期回應做調整
  });

  // test('create Asset', async () => {
  //   prismaMock.authToken.findMany.mockResolvedValue([]);
  //   const { req, res } = createMocks({ method: 'POST', headers: { authorization: "bearar 123456" }, body: { name: 'test', categoryId: 3 } });
  //   const mockedHandleAsset = handleAsset(prismaMock);
  //   await mockedHandleAsset(req as any, res as any);
  //   expect(res._getStatusCode()).toBe(200);
  // })
});

export { }