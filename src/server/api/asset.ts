import { Category, RepresentationUsage, Representation } from '@prisma/client';
import * as assetRepo from '../database/asset';
import * as categoryRepo from '../database/category';
import util from '../../utils/util';
import { settings } from '../../libs/common';
const {
  formatBytes,
} = util;

type FERepresentation = Omit<Representation, 'isDeleted' | 'isVisible'> & {
  filesize: string;
};


export async function assetDetail(assetId: string) {
  const asset = await assetRepo.get(assetId)
  if (!asset) {
    return asset;
  }
  const categories = await categoryRepo.list();

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
    thumbnail: "",
    name: asset!.name,
    description: asset!.description,
    categoryList: categoryList,
    updateAt: asset!.updateAt,
    createAt: asset!.createAt,
    creator: asset!.creator.name,
    tags: asset!.tags,
    previews: new Array<FERepresentation>(),
    downloads: new Array<FERepresentation>(),
  }

  asset.representations.forEach((element, _index) => {
    switch (element.usage) {
      case RepresentationUsage.THUMBNAIL: {
        if (element.path !== null) assetReturn.thumbnail = element.path;
        break;
      }
      case RepresentationUsage.PREVIEW: {
        const { isVisible, isDeleted, ...feRepresentation } = element;
        const preview = {
          ...feRepresentation,
          path: element.path ? `${settings.RESOURCE_URL}${element.path}` : '',
          filesize: formatBytes(element.fileSize ? element.fileSize : 0),
        }
        assetReturn.previews.push(preview)
        break;
      }
      case RepresentationUsage.DOWNLOAD: {

        const { isDeleted, isVisible, ...feRepresentation } = element;
        const download = {
          ...feRepresentation,
          path: element.path ? `${settings.RESOURCE_URL}${element.path}` : '',
          filesize: formatBytes(element.fileSize ? element.fileSize : 0),
        }

        assetReturn.downloads.push(download)
        break;
      }
      default: {
        break;
      }
    }
  });

  return assetReturn;
}
