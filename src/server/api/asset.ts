import { Category, RepresentationType } from '@prisma/client';
import * as assetRepo from '../database/asset';
import * as categortRepo from '../database/category';
import util from '../../utils/util';

const {
  formatBytes,
} = util;


export async function assetDetail(assetId: string) {
  const asset = await assetRepo.get(assetId)
  if (!asset) {
    return asset;
  }
  const categories = await categortRepo.list();

  const cate_dict: { [id: number]: Category; } = {};
  categories.forEach((cate, _index) => {
    cate_dict[cate.id] = cate;
  });

  // 組合 asset 麵包屑
  const getCategoryList = (categoryId: number, categoryList: string | null): string => {
    const cate = cate_dict[categoryId]
    const newList = (categoryList == null) ? cate.name : `${cate.name}\\${categoryList}`

    if (cate !== undefined && cate.parentId !== null)
      return getCategoryList(cate.parentId, newList);
    else
      return newList == null ? "" : newList;
  };
  const categoryList = getCategoryList(asset!.categoryId, "")

  const assetReturn = {
    id: asset!.id,
    preview: "",
    name: asset!.name,
    categoryList: categoryList,
    updateAt: asset!.updateAt,
    createAt: asset!.createAt,
    creator: asset!.creator.name,
    tags: asset!.tags,
    renders: new Array(),
    downloads: new Array(),
  }

  asset.representations.forEach((element, _index) => {
    switch (element.type) {
      case RepresentationType.PREVIEW: {
        if (element.path !== null) assetReturn.preview = element.path;
        break;
      }
      case RepresentationType.RENDER: {
        const render = {
          id: element.id,
          name: element.name,
          path: element.path ? element.path : '',
        }
        assetReturn.renders.push(render)
        break;
      }
      case RepresentationType.MODEL: {
        const download = {
          id: element.id,
          name: element.name,
          format: element.format,
          fileSize: formatBytes(element.fileSize ? element.fileSize : 0),
        }
        assetReturn.downloads.push(download)
        break;
      }
      default: {
        break;
      }
    }
  });

}