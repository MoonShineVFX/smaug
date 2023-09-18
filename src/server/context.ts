import * as trpc from '@trpc/server';
import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { authenticateUser1 } from '../libs/server/auth';

export async function createContext({ req, res, }: trpcNext.CreateNextContextOptions) {

  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const user = await authenticateUser1(
        req.headers.authorization.split(' ')[1],
      );
      return user;
    }
    return null;
  }
  
  const user = await getUserFromHeader();
  return {
    req, 
    res,
    user,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;