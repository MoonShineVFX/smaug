import { createMocks } from 'node-mocks-http';
import handleLogin from '../../../pages/api/login';
// import { PrismaClient } from '@prisma/client';
import {prismaMock} from '../../../singleton'


// let prisma: PrismaClient;

beforeEach(() => {
  // prisma = new PrismaClient();
});


afterEach(async () => {
  await prismaMock.$disconnect();
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
    expect(
      Object.keys(res._getJSONData()).sort()).toEqual(
      ['email', 'id', 'name', 'picture', 'account', 'createAt', 'extenData', 'roleId', 'roleName', 'type', 'updateAt'].sort())
    await prismaMock.authToken.deleteMany({});
  });

  it('should return 401 when no authorization header', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });
    await handleLogin(req, res);
    expect(res._getStatusCode()).toBe(401);
  });
});

