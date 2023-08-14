import { JsonValue } from 'type-fest';

export type UserDisplayInfo = {
  id: string;
  name: string;
  email: string;
  picture: string;
  account: string;
  roleId: string;
  roleName: string;
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
  preview: string | null
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
  downloads: Array<{ id: string, name: string, format: string, fileSize: string }>;
}

//api/menu
export interface MenuListItem {
  id: string
  name: string
}

//api/menuTree/[menuId]

export type CategoryTree = {
  id: string;
  name: string;
  children: CategoryTree[];
}

export interface MenuWithCategoriesResponse {
  id: string;
  name: string;
  iconName: string;
  children: CategoryTree[];

}