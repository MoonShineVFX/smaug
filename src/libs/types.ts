import { JsonValue } from 'type-fest';
import type { inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../server/routers/_app';
type RouterOutput = inferRouterOutputs<AppRouter>;
export type AssetDetailOutput = RouterOutput['assets']['get']['detail'];

export type UserDisplayInfo = {
  id: string;
  name: string;
  email: string;
  picture: string;
  account: string;
  roles: Array<{ name: string }>;
  type: string;
  updateAt: Date | null;
  createAt: Date;
  extenData: JsonValue;
}

// api routes interface

// api/auth/login.ts
export interface LoginParams {
  username: string;
  password: string;

}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface LoginResponse {
  token: string;
  user: UserDisplayInfo;
}


// api/assets/index.ts
export interface AssetListItem {
  id: string
  name: string
  preview: string
  categoryName: string | null
  updateAt: Date | null
  createAt: Date
}

// api/assets/[assetId].ts
export interface AssetDetails {
  id: string;
  preview: string;
  name: string;
  categoryList: string;
  updateAt: Date | null;
  createAt: Date;
  creator: string;
  tags: Array<{ id: string, name: string }>;
  renders: Array<{ id: string, name: string, path: string }>;
  downloads: Array<{ id: string, name: string, format: string | null, fileSize: string }>;
}

//api/assets/ POST
export interface AssetCreateParams {
  name: string;
  categoryId: number;
  tags: Array<string>;
  creatorId: string;
}

//api/menu
export interface MenuListItem {
  id: string
  name: string
}

//api/menuTree/[menuId]

export type CategoryTree = {
  id: number;
  name: string;
  children: CategoryTree[];
}

export interface MenuWithCategoriesResponse {
  id: string;
  name: string;
  iconName: string;
  children: CategoryTree[];

}