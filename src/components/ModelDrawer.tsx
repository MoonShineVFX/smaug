import { CircularIndeterminate, EmptyState, ErrorState } from './basic';
import { NonNullableAssetDetailOutput } from '../libs/types';
import { RepresentationUsage } from '@prisma/client';
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import Drawer from '@mui/material/Drawer';
import React from 'react';

import AssetInfo from './assetDetail/Info';
import DownloadComponent from './assetDetail/Downloads';
import TagsComponent from './assetDetail/Tags';
import PreviewComponent from './assetDetail/Preview';

interface IModelDrawerProps {
  assetId: string | undefined;
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}


export default function ModelDrawer({ assetId, openDrawer, setOpenDrawer }: IModelDrawerProps) {
  const router = useRouter();
  const assetDetailQry = trpc.assets.get.useQuery({ assetId: assetId ? assetId : "" }, { enabled: !!assetId });

  if (assetId === undefined) {
    return (openDrawer ? <EmptyState /> : <></>)
  }

  if (assetDetailQry.isError) {
    return <ErrorState />
  }

  if (assetDetailQry.isLoading) {
    return (openDrawer ? <CircularIndeterminate /> : <></>)
  }

  if (assetDetailQry.isSuccess && assetDetailQry.data.detail === null) {
    return <EmptyState />
  }

  const assetDetail = assetDetailQry.data.detail as NonNullableAssetDetailOutput;
  const dlowloads = assetDetail.representations.filter((representation) => representation.usage === RepresentationUsage.DOWNLOAD);

  return (
    <Drawer
      anchor="right"
      open={openDrawer}
      variant="persistent"
      PaperProps={{
        sx: { minWidth: '460px', maxWidth: '460px' }
      }}
    >
      <PreviewComponent assetDetail={assetDetail} setOpenDrawer={setOpenDrawer} />
      <AssetInfo assetDetail={assetDetail} />
      <TagsComponent tags={assetDetail.tags} />
      <DownloadComponent downloads={dlowloads} />
    </Drawer >
  )
}