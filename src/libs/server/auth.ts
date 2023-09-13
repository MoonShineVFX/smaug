import bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client'
import { settings } from '../common';
import { NextApiRequest, NextApiResponse } from 'next'
import { NextRequest } from 'next/server';
import { LoginParams, LoginResponse, UserDisplayInfo } from '../types';
import  prisma from '../../client';

type IAuthToken = {
  id: string;
};

type IUserWithTokens = User & {
  role: { name: string };
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
    const userInfo: UserDisplayInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: 'noPicture.png',
      account: user.account,
      roleId: user.roleId,
      roleName: user.role.name,
      type: user.type,
      updateAt: user.updateAt,
      createAt: user.createAt,
      extenData: user.extenData
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
      },
      role: {
        select: {
          name: true
        }
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


// next-connect middleware

export async function authenticateUser(req: NextApiRequest, res: NextApiResponse, next: any) {
  console.log('Entering authenticateUser')
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (Boolean(token)) {
    // 用 token 查詢 authToken 資料表，找到對應的使用者
    const authTokenObj = await prisma.authToken.findUnique(
      {
        where: { id: token },
        include: { user: true }
      });
    // 將 user 資訊附加到 req 物件上
    (req as any).user = authTokenObj ? authTokenObj.user : null;
    console.log('Exist authenticateUser')
  }
  else {
    (req as any).user = null;
    console.log('Exist authenticateUser: No token')
  };
  next();
}

