import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { prisma } from './prisma';
import { settings } from '../common';


type UserInfo = {
  id: string;
  name: string;
  email: string;
  picture: string;
}
interface ILoginParams {
  username: string;
  password: string;
}

interface IUser {
  id: string;
  password: string;
  name: string;
  authTokens: { id: string }[];
}


export async function auth(credential: ILoginParams): Promise<String | null> {

  const user = await findUserByAccount(credential.username);

  if (!user) {
    return null;
  }

  if (await comparePassword(credential.password, user.password)) {
    const newToken = createToken(user)
    await limitedTokenNumber(user)
    return newToken
  }
  else {
    return null;
  }
}


export async function findUserByAccount(account: string): Promise<IUser | null> {
  const user = await prisma.user.findUnique({
    where: {
      account: account
    },
    select:
    {
      id: true,
      password: true,
      name: true,
      authTokens: {
        select: {
          id: true
        },
      }
    }
  });
  return user;
}


export async function hashPassword(password: string): Promise<string> {
  const saltRounds = Number(process.env.SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}


export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  const result: boolean = await bcrypt.compare(password, hashedPassword);
  return result;
}


export async function createToken(user: IUser): Promise<string> {
  const token = await prisma.authToken.create({ data: { userId: user.id } });
  return token.id;
}


export async function limitedTokenNumber(user: IUser): Promise<void> {
  if (user.authTokens.length > settings.TOKEN_PER_USER) {
    let tokens = await prisma.authToken.findMany({ where: { userId: user.id }, orderBy: { createAt: 'desc' } });
    let preserveTokens = tokens.splice(0, settings.TOKEN_PER_USER);
    const tokenIds = tokens.map((token) => token.id);
    await prisma.authToken.deleteMany({ where: { id: { in: tokenIds } } });
  }
}
export type { UserInfo };