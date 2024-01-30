import React, { useState } from 'react';
import { useRouter } from "next/router";
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { styled } from "@mui/material/styles";
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';

import { trpc } from "../utils/trpc";
import { CircularIndeterminate, EmptyState, ErrorState } from './basic';
import { NonNullableAssetDetailOutput } from '../libs/types';
import { RepresentationFormat, RepresentationType, RepresentationUsage } from '@prisma/client';
import { CardActions } from '@mui/material';

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


const AssetCardContent = styled(Box)(({ theme }) => ({
  backgroundColor: '#333',
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(1),
  },
}));


interface PreviewProps {
  assetDetail: NonNullableAssetDetailOutput;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ViewState {
  isRender: boolean;
  is3D: boolean;
  isTexture: boolean;
}

const PreviewComponent = ({ assetDetail, setOpenDrawer }: PreviewProps) => {
  const router = useRouter();
  const [viewState, setViewState] = useState<ViewState>({ isRender: true, is3D: false, isTexture: false });

  const previews = assetDetail.representations.filter((representation) => { return representation.usage === RepresentationUsage.PREVIEW });
  const thumbnail = previews.filter((preview) => {
    return preview.usage === RepresentationUsage.THUMBNAIL &&
      preview.type === RepresentationType.RENDER &&
      preview.format === RepresentationFormat.IMG
  });
  const renders = previews.filter((preview) => { return preview.type === RepresentationType.RENDER && preview.format === RepresentationFormat.IMG });
  const thumbPlusRenders = [...thumbnail, ...renders]
  const textures = previews.filter((preview) => { return preview.type === RepresentationType.TEXTURE && preview.format === RepresentationFormat.IMG });
  const preview3d = previews.filter((preview) => {
    return preview.type === RepresentationType.MODEL &&
      preview.format === RepresentationFormat.GLB
  });

  const onRenderClick = () => {
    setViewState({ isRender: true, is3D: false, isTexture: false })
  }
  const onTextureClick = () => {
    setViewState({ isRender: false, is3D: false, isTexture: true })
  }
  const on3DClick = () => {
    setViewState({ isRender: false, is3D: true, isTexture: false })
  }

  const shouldDisplayRenderIcon = (viewState: ViewState) => {
    if (viewState.isRender && !viewState.is3D && !viewState.isTexture) {
      return false;
    }

    if (!viewState.isRender) {
      return false;
    }

    return true
  }

  const shouldDislapyTextureIcon = (viewState: ViewState) => {
    return viewState.isTexture
  }

  const shouldDisplay3DIcon = (viewState: ViewState) => {
    return viewState.is3D
  }

  return (
    <Box sx={{ minHeight: '360px' }}>
      <Card sx={{ position: "relative", width: "100%", height: "100%" }}>
        <Swiper
          modules={[Navigation]}
          navigation={true}
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
          style={{ position: 'absolute', width: "100%", height: "100%", objectFit: "contain" }}
        >
          {
            thumbPlusRenders.map((picPeperesentation, _) => {
              return (
                <SwiperSlide key={picPeperesentation.id} style={{ height: "100%" }}>
                  <img src={picPeperesentation.path} alt={picPeperesentation.name} style={{ objectFit: "contain", height: '100%', width: "100%", paddingTop: "14px", zIndex: 1 }} />
                </SwiperSlide>
              )
            })
          }
        </Swiper>

        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: "100%",
            marginTop: 8,
            zIndex: 2,
          }}
        >
          <CardActions sx={{ position: 'absolute', width: '100%', justifyContent: 'space-between', paddingLeft: 0, paddingRight: 6 }}>
            <ButtonGroup
              variant="contained"
              color="primary"
              size="small"
            >
              <ViewIconButton isActive={viewState.isRender} onClick={onRenderClick} ><ImageOutlinedIcon fontSize="small" /></ViewIconButton>
              <ViewIconButton isActive={viewState.isTexture} onClick={onTextureClick} ><TextureOutlinedIcon fontSize="small" /></ViewIconButton>
              <ViewIconButton isActive={viewState.is3D} onClick={on3DClick}><ViewInArOutlinedIcon fontSize="small" /></ViewIconButton>
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
          </CardActions>
        </Toolbar>
      </Card >
    </Box >
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
    [RepresentationFormat.UNITY]: "Unity Package",
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
              downloads.map((download, _) => (
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