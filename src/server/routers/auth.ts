import cookie from 'cookie'
import { z } from 'zod';
import { authenticate, getToken } from '../../libs/server/auth';
import { removeToken } from '../database/auths';
import { publicProcedure, router } from '../trpc';


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
          httpOnly: true,
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
    .mutation(async (opts) => {
      const {req } = opts.ctx
      const token = getToken(req)
      if (token) {
        return removeToken(token)
      }
      else {
        throw new Error("network error or token already removed?")
      }
    })
})