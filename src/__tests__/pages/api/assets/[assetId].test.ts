import { createMocks } from 'node-mocks-http';
import handleAsset from '../../../../pages/api/assets/[assetId]'
import { prismaMock } from '../../../../singleton';


describe('Assets Detail API', () => {

  test('asset detail', async () => {

    prismaMock.asset.findUnique.mockResolvedValue({
      id: 'fake-uuid-12345',
      name: 'fake-asset-name',
      categoryId: 1,
      tags: [],
      creator: {
        name: 'admin'
      },
      updateAt: null,
      createAt: new Date(),
    } as any);
    prismaMock.category.findMany.mockResolvedValue([{id:1, parentId: null, name: "No Category"},] as any);
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        assetId: 'fake-uuid-12345' 
      }
    });
    prismaMock.representation.findMany.mockResolvedValue([])


    await handleAsset(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    console.log(res);
  })
});


export { }