// api routes interface

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