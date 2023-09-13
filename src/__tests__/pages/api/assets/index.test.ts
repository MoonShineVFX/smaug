import { createMocks } from 'node-mocks-http';
import { Asset } from '@prisma/client';
import { handleAsset } from '../../../../pages/api/assets'
import { prismaMock } from '../../../../singleton';
import { mockReset } from 'jest-mock-extended';
import { AssetListItem } from '../../../../libs/types';
import { settings } from '../../../../libs/common';


// let prisma: PrismaClient;

beforeEach(async () => {
  mockReset(prismaMock);
});

afterEach(async () => {
  // await prismaMock.authToken.deleteMany({});
  // await prismaMock.$disconnect();
})

describe('Assets GET, POST', () => {

  test('param list "cid"', async () => {
    // 預設回應模擬
    const mockAssetFindMany = [
      {
        id: "ccl3yzdcqmqqhvgy0eh9tasq",
        name: "Hat",
        representations: [{ path: "" },],
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
        representations: [{ path: "g0hb02576av7sy9vrg89cd6q/eszi8mubh7y0linfqnor6jdm_preview.png", },],
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
        preview: `${settings.RESOURCE_URL}/g0hb02576av7sy9vrg89cd6q/eszi8mubh7y0linfqnor6jdm_preview.png`,
        categoryName: "Fish",
        updateAt: null,
        createAt: "2023-03-06T09:06:05.325Z"
      },
    ]
    prismaMock.category.findUnique.mockResolvedValue({ path: "2/1" } as any);
    prismaMock.asset.findMany.mockResolvedValue(mockAssetFindMany as any);

    const mockedHandleAsset = handleAsset(prismaMock);
    const { req, res } = createMocks({ method: 'GET', query: { cid: 3 } });

    await mockedHandleAsset(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const reData = res._getJSONData()
    expect(reData).toEqual(excpet_result);  // 請根據你的預期回應做調整
  });

  test('create Asset', async () => {
    prismaMock.authToken.findUnique.mockResolvedValue(
      {
        id: "token-123456",
        userId: "admin",
        user: {
          id: "admin",
          type: "HUMAN",
          account: "admin",
          roleId: 1,
          name: "管理員",
          email: "admin@moonshine.tw",
          password: "123456",
          createAt: new Date(),
          active: true,
          updateAt: null,
        },
        createAt: new Date(),
      } as any
    );

    const the_data = new Date();

    prismaMock.asset.create.mockResolvedValue({
      id: "test",
      name: "test",
      representations: [{ path: "" },],
      category: {
        name: "No Category",
        path: "3",
      },
      createAt: the_data,
      updateAt: null,
      isDeleted: false,
      creatorId: "admin"
    } as any);

    const exceptAssetData = {
      id: "test",
      name: "test",
      representations: [{ path: "" },],
      category: {
        name: "No Category",
        path: "3",
      },
      createAt: the_data,
      updateAt: null,
    };

    const { req, res } = createMocks(
      { method: 'POST', headers: { authorization: "token-123456" }, body: { name: 'test', categoryId: 3 } });
    const mockedHandleAsset = handleAsset(prismaMock);
    await mockedHandleAsset(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual(exceptAssetData);
  });
});

export { }