import { createMocks } from 'node-mocks-http';
import handlerTag from '../../../../pages/api/tags'
import { prismaMock } from '../../../../singleton';

// let prisma: PrismaClient;

// beforeEach(async () => {
//   prisma = new PrismaClient();
// })

// afterEach(async () => {
//   await prisma.authToken.deleteMany({});
//   await prisma.$disconnect();
// })

describe('Menus API', () => {

  test('return menus list', async () => {
    prismaMock.tag.findMany.mockResolvedValue([] as any);
    
    const { req, res } = createMocks({ method: 'GET' });

    await handlerTag(req, res);
    expect(res._getStatusCode()).toBe(200);
  })
})
