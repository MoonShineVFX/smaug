import bcrypt from 'bcrypt';
import { prisma } from './prisma';
import { User } from '@prisma/client'
import { settings } from '../common';
import { NextApiRequest } from 'next'
import { NextRequest } from 'next/server';
import { LoginParams, LoginResponse, UserInfo } from '../types';


type IAuthToken = {
  id: string;
};

type IUserWithTokens = User & {
  authTokens: IAuthToken[];
};


export async function authenticated(req: NextRequest): Promise<User | null> {

  const auth_str = req.headers.get('authorization');
  if (auth_str == null) {
    return null;
  }

  const [auth_header, token] = auth_str.split(' ')
  if (auth_header != 'Bearer') {
    return null;
  }

  const user = await prisma.authToken.findUnique({
    where: { id: token }
  }).user();

  if (user != null && user.active) {
    return user;
  }
  else {
    return null;
  }
};


export async function authenticate(credential: LoginParams): Promise<LoginResponse | null> {

  const user = await findUserByAccount(credential.username);

  if (!user) {
    return null;
  }

  if (await comparePassword(credential.password, user.password)) {
    const newToken = await createToken(user)
    await limitedTokenNumber(user)
    const userInfo: UserInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: 'noPicture.png'
    }
    return { token: newToken, user: userInfo };
  }
  else {
    return null;
  }
}


export async function findUserByAccount(account: string): Promise<IUserWithTokens | null> {
  const user = await prisma.user.findUnique({
    where: {
      account: account
    },
    include:
    {
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


export async function createToken(user: IUserWithTokens): Promise<string> {
  const token = await prisma.authToken.create({ data: { userId: user.id } });
  return token.id;
}


export async function limitedTokenNumber(user: IUserWithTokens): Promise<void> {
  if (user.authTokens.length > settings.TOKEN_PER_USER) {
    let tokens = await prisma.authToken.findMany({ where: { userId: user.id }, orderBy: { createAt: 'desc' } });
    let preserveTokens = tokens.splice(0, settings.TOKEN_PER_USER);
    const tokenIds = tokens.map((token) => token.id);
    await prisma.authToken.deleteMany({ where: { id: { in: tokenIds } } });
  }
}


export function getToken(req: NextApiRequest): string {
  let authStr: string | undefined;
  if (req.headers) {
    authStr = req.headers['authorization'];
  }

  if (!authStr) {
    return "";
  }

  const [auth_header, token] = authStr.split(' ')
  if (auth_header != 'Bearer') {
    return "";
  }
  return token;
}


// export function verifyToken(req: NextRequest): Promise<UserInfo | null> {
//   let authStr = req.headers.get('authorization')
//   const token = getToken(authStr);

//   if (!token) {
//     return null;
//   }
//   let user = prisma.authToken.findUnique({
//     where: { id: token }
//   }).user();

//   if (!user) {
//     return null;
//   }
//   return getUserInfo(user);
// }

// function getUserInfo(user: User): UserInfo {
//   let userInfo: UserInfo = {
//     id: user.id,
//     name: user.name,
//     email: user.email,
//     picture: 'no_avatar.png'
//   }
//   return userInfo;
// }
export type { UserInfo };
