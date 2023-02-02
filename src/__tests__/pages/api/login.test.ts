import { createMocks } from 'node-mocks-http';
import handleLogin from '../../../pages/api/categories';
import { PrismaClient } from '@prisma/client';


let prisma: PrismaClient;

beforeEach(() => {
  prisma = new PrismaClient();
});


afterEach(async () => {
  await prisma.$disconnect();
});


describe('Login API', () => {

  it('should return 200 when login successfully and get access token', async () => {

    const authString = 'admin:admin';
    const encodedAuthString = Buffer.from(authString).toString('base64');

    const { req, res } = createMocks({
      method: 'POST',
      headers: { authorization: `Basic ${encodedAuthString}` }
    });
    await handleLogin(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'welcome' });
    await prisma.authToken.deleteMany({});
  });

  it('should return 401 when no authorization header', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });
    await handleLogin(req, res);
    expect(res._getStatusCode()).toBe(401);
  });
});

