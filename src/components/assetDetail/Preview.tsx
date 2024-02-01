import 'swiper/css';
import 'swiper/css/navigation';

import { Box, Button, ButtonGroup, Card, CardActions, IconButton, Toolbar } from "@mui/material";
import { Navigation } from "swiper/modules";
import { RepresentationFormat, RepresentationType, RepresentationUsage } from "@prisma/client";
import { styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRouter } from "next/router";
import { useState } from "react";

import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TextureOutlinedIcon from '@mui/icons-material/TextureOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';

import { NonNullableAssetDetailOutput } from "../../libs/types";


const ViewIconButton = styled(Button)<{ isActive?: boolean; }>((ViewIconButtonProps) => ({
  '&:hover': { backgroundColor: '#444' },
  '&:active': { backgroundColor: '#303030' },
  ...(ViewIconButtonProps.isActive && {
    backgroundColor: '#505050',
  })
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
      <Card sx={{
        position: "relative",
        width: "100%",
        height: "100%"
      }}>
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
              {shouldDisplayRenderIcon(viewState) &&
                <ViewIconButton isActive={viewState.isRender} onClick={onRenderClick} ><ImageOutlinedIcon fontSize="small" /></ViewIconButton>}
              {shouldDislapyTextureIcon(viewState) &&
                <ViewIconButton isActive={viewState.isTexture} onClick={onTextureClick} ><TextureOutlinedIcon fontSize="small" /></ViewIconButton>}
              {shouldDisplay3DIcon(viewState) &&
                <ViewIconButton isActive={viewState.is3D} onClick={on3DClick}><ViewInArOutlinedIcon fontSize="small" /></ViewIconButton>}
            </ButtonGroup>
            <ButtonGroup
              variant="text"
              color="primary"
              size="small"
            >
              <IconButton aria-label="fullscreen">
                <FullscreenIcon />
              </IconButton>
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
            </ButtonGroup>
          </CardActions>
        </Toolbar>
      </Card >
    </Box >
  )
}

export default PreviewComponent;