import cookie from 'cookie'
import { z } from 'zod';
import { authenticate, getToken } from '../../libs/server/auth';
import { removeToken } from '../database/auths';
import { publicProcedure, router } from '../trpc';
import { authenticateUser1 } from  '../../libs/server/auth';
import { UserDisplayInfo } from '../../libs/types';


export const authRouter = router({
  login: publicProcedure
    .input(z.object({ authorization: z.string() }))
    .mutation(async (opts) => {
      const {ctx} = opts;
      const { authorization } = opts.input;
      const credentials = Buffer.from(authorization, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');
      const loginResponse = await authenticate({ username: username, password: password });
      if (loginResponse) {
        // 在這裡設置 cookie
        const serializedCookie = cookie.serialize('authToken', loginResponse.token, {
          httpOnly: false,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          path: '/',
          maxAge: 3600,
        });
        ctx.res.setHeader('Set-Cookie', serializedCookie);
        return {user :loginResponse.user};
      }
      else {
        throw new Error("invalid username or password")
      }
    }),

  logout: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async (opts) => {
      const {req } = opts.ctx
      const token = getToken(req)
      if (token) {
        return removeToken(token)
      }
      else {
        throw new Error("network error or token already removed?")
      }
    }),
  
    userByToken: publicProcedure
    .query(async (opts) => {
      const {req } = opts.ctx
      const token = getToken(req)
      if (token) {
        const raw_user = await authenticateUser1(token)
        if (!raw_user) {
          throw new Error("network error or token already removed?")
        }
        const { active, password, ...user } = raw_user
        const userInfo: UserDisplayInfo = {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: 'noPicture.png',
          account: user.account,
          roles: user.roles,
          type: user.type,
          updateAt: user.updateAt,
          createAt: user.createAt,
          extenData: user.extenData
        }
        return {user: userInfo}
      }
      else {
        throw new Error("network error or token already removed?")
      }
    }),
})