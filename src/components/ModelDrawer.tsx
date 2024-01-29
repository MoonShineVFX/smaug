import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import { useRouter } from "next/router";

import { styled } from "@mui/material/styles";
import { trpc } from "../utils/trpc";
import { CircularIndeterminate, EmptyState, ErrorState } from './basic';
import { NonNullableAssetDetailOutput } from '../libs/types';
import { RepresentationFormat, RepresentationType, RepresentationUsage, Tag } from '@prisma/client';

interface IModelDrawerProps {
  assetId: string | undefined;
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
  isActive?: boolean;
}

const ViewIconButton = styled(Button)<Props>((ViewIconButtonProps) => ({
  '&:hover': { backgroundColor: '#444' },
  '&:active': { backgroundColor: '#303030' },
  ...(ViewIconButtonProps.isActive && {
    backgroundColor: '#505050',
  })
}));


const AssetCardContent = styled(CardContent)(({ theme }) => ({
  backgroundColor: '#333',
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(1),
  },
}));


interface PreviewProps {
  assetDetail: NonNullableAssetDetailOutput;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewComponent = ({ assetDetail, isActive, setIsActive, setOpenDrawer }: PreviewProps) => {
  const router = useRouter();
  const sliderShowRepre = [assetDetail.thumbnail, ...assetDetail.representations]

  return (
    <>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1]
        }}
      >
      </Toolbar>

      <Card sx={{}}>
        <div style={{ position: "relative" }}>
          <CardMedia  // preview area
            component="img"
            height="280"
            image={assetDetail.thumbnail === "" ? '/no-image.jpg' : assetDetail.thumbnail}
            alt={assetDetail.name}
            sx={{ objectFit: "cover", bgcolor: "#202020", p: 0, width: '100%', hight: '100%' }}
          />
          <Box sx={{ position: 'absolute', width: '100%', px: 2, top: '10px', display: 'flex', justifyContent: "space-between" }}>
            <ButtonGroup
              variant="contained"
              color="primary"
              size="small"
            >
              <ViewIconButton isActive={isActive} onClick={() => setIsActive(!isActive)} ><ImageOutlinedIcon fontSize="small" /></ViewIconButton>
              {assetDetail.previews.length > 0 && <ViewIconButton ><ViewInArOutlinedIcon fontSize="small" /></ViewIconButton>}
            </ButtonGroup>
            <IconButton aria-label="close" onClick={() => {
              setOpenDrawer(false)
              setTimeout(() => {
                const { assetId, ...queryNoAssetId } = router.query;
                router.push(
                  {
                    pathname: router.pathname,
                    query: queryNoAssetId,
                  },
                  undefined,
                  { shallow: true }
                )
              }, 500)

            }}>
              <CloseIcon /> {/* 關閉 Drawer 按鈕*/}
            </IconButton>
          </Box>
          {
            assetDetail.previews.length > 0 ?
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>Loading</Typography>
              :
              <Box sx={{ position: 'absolute', width: '100%', px: 2, bottom: '10px', display: 'flex', justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>Render Images : 0</Typography>
              </Box>
          }
        </div>
      </Card >
    </>
  )
}


interface AssetInfoProps {
  assetDetail: NonNullableAssetDetailOutput;
}

const AssetInfo = ({ assetDetail }: AssetInfoProps) => {
  return (
    < AssetCardContent sx={{ backgroundColor: '#333', px: 2, py: 2 }
    }>
      <Typography gutterBottom={true} variant="h5" component="div" sx={{ fontWeight: 'bolder', textTransform: 'uppercase', mb: 0 }}>
        {assetDetail.name}
      </Typography>
      <Typography variant="body1" component="div" sx={{ py: 0.5, fontWeight: 'bolder', textTransform: 'uppercase', mb: 0, minHeight: '1em', }}>
        {assetDetail.description === "" ? " " : assetDetail.description}
      </Typography>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: '', letterSpacing: '', fontSize: 13 }}>
            {assetDetail.categoryList?.replace(/\\/g, " > ").slice(0, -2)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>
            Created at {assetDetail.createAt?.toLocaleString().substr(0, 10)} by {assetDetail.creator}
          </Typography>
        </Grid>
      </Grid>
    </AssetCardContent >
  )
}


const TagsComponent = ({ tags }: { tags: NonNullableAssetDetailOutput["tags"] }) => {
  return (
    <Box sx={{ px: 2, backgroundColor: '#333', borderTop: "solid", borderColor: "#666", borderWidth: "thin" }}>
      <Box sx={{ py: 3 }}>
        <Typography variant="h6" color="text.secondary" sx={{ fontSize: 18 }}>
          Tags
        </Typography>

        {tags.length == 0 ?
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'center' }}>No Tags Yet</Typography>
          :
          <Box sx={{
            display: 'flex',
            flexWrap: "wrap",
            p: 2,
            mt: 1,
          }}>
            {tags.map((tag, _index) => {
              return (
                <Chip
                  key={tag.id} label={tag.name}
                  onClick={() => {
                    console.log(`${tag.name} is pressed`)
                  }}
                  sx={{ m: .5, fontSize: 13 }} />
              )
            })}
          </Box>
        }

      </Box>
    </Box>
  )
}


const DownloadComponent = ({ downloads }: { downloads: NonNullableAssetDetailOutput["representations"] }) => {
  const formatNames: { [key in RepresentationFormat]: string } = {
    [RepresentationFormat.MAX]: "3ds Max",
    [RepresentationFormat.MB]: "Maya",
    [RepresentationFormat.FBX]: "FBX",
    [RepresentationFormat.OBJ]: "OBJ",
    [RepresentationFormat.C4D]: "Cinema 4D",
    [RepresentationFormat.UNREAL]: "Unreal Engine Asset",
    [RepresentationFormat.UNITY]: "Unity Pakage",
    [RepresentationFormat.USD]: "USD",
    [RepresentationFormat.IMG]: "Image",
    [RepresentationFormat.GLB]: "GLB",
  };

  return (
    <Box sx={{ px: 2 }}>
      <Box sx={{ pt: 3 }}>
        <Typography variant="h5" color="text.primary" >
          Download
        </Typography>
        <Box>
          {
            downloads.length === 0 ?
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                  No Downloadable File Now
                </Typography>
              </Box>
              :
              downloads.map((download, index) => (
                <Box key={download.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, borderBottom: "solid", borderWidth: "1px", borderColor: "#ccc" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                    {`${formatNames[download.format!]} ${download.filesize}`}
                  </Typography>
                  <IconButton
                    aria-label="download"
                    size="large"
                    sx={{ fontSize: 16, borderRadius: "6%", marginBottom: 1, p: 1 }}
                    href={download.path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    下載
                    <ArrowCircleDownIcon fontSize="large" sx={{ marginLeft: 1 }} />
                  </IconButton>
                </Box>
              ))
          }
        </Box>
      </Box>
    </Box>
  )
}


export default function ModelDrawer({ assetId, openDrawer, setOpenDrawer }: IModelDrawerProps) {

  const [isActive, setIsActive] = useState(false);
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
  const previews = assetDetail.representations.filter((representation) => representation.usage === RepresentationUsage.PREVIEW);
  const dlowloads = assetDetail.representations.filter((representation) => representation.usage === RepresentationUsage.DOWNLOAD);

  return (
    <Drawer
      anchor="right"
      open={openDrawer}
      variant="persistent"
      PaperProps={{
        sx: { width: '25%' }
      }}
    >
      <PreviewComponent assetDetail={assetDetail} isActive={isActive} setIsActive={setIsActive} setOpenDrawer={setOpenDrawer} />
      <AssetInfo assetDetail={assetDetail} />
      <TagsComponent tags={assetDetail.tags} />
      <DownloadComponent downloads={dlowloads} />
    </Drawer >
  )
}