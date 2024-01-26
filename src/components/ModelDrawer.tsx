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
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import { useRouter } from "next/router";

import { styled } from "@mui/material/styles";
import { trpc } from "../utils/trpc";
import { CircularIndeterminate, EmptyState, ErrorState } from './basic';
import { NonNullableAssetDetailOutput } from '../libs/types';

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


interface AssetInfoProps {
  assetDetail: NonNullableAssetDetailOutput;
}


const AssetInfo = ({ assetDetail }: AssetInfoProps) => {
  return (
    < AssetCardContent sx={{ backgroundColor: '#333', px: 2, py: 2 }
    }>
      <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bolder', textTransform: 'uppercase', mb: 0 }}>
        {assetDetail.name}
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

  return (
    <Drawer
      anchor="right"
      open={openDrawer}
      variant="persistent"
      PaperProps={{
        sx: { width: '25%' }
      }}
    >
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
            image={assetDetailQry.data.detail!.thumbnail === "" ? '/no-image.jpg' : assetDetailQry.data.detail!.thumbnail}
            alt={assetDetailQry.data.detail!.name}
            sx={{ objectFit: "cover", bgcolor: "#202020", p: 0, width: '100%', hight: '100%' }}
          />
          <Box sx={{ position: 'absolute', width: '100%', px: 2, top: '10px', display: 'flex', justifyContent: "space-between" }}>
            <ButtonGroup
              variant="contained"
              color="primary"
              size="small"
            >
              <ViewIconButton isActive={isActive} onClick={() => setIsActive(!isActive)} ><ImageOutlinedIcon fontSize="small" /></ViewIconButton>
              {assetDetailQry.data.detail!.previews.length > 0 && <ViewIconButton ><ViewInArOutlinedIcon fontSize="small" /></ViewIconButton>}
            </ButtonGroup>
            <IconButton aria-label="close" onClick={() => {
              setOpenDrawer(false)
              setTimeout(() => {
                router.query.assetId = [];
                router.push(router)
              }, 500)

            }}>
              <CloseIcon /> {/* 關閉 Drawer 按鈕*/}
            </IconButton>
          </Box>
          {
            assetDetailQry.data.detail!.previews.length > 0 ?
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>Loading</Typography>
              :
              <Box sx={{ position: 'absolute', width: '100%', px: 2, bottom: '10px', display: 'flex', justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>Render Images : 0</Typography>
              </Box>
          }
        </div>
      </Card >

      <AssetInfo assetDetail={assetDetail} />

      <Box sx={{ p: 2 }}>
        <Box sx={{ pt: 3 }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: 18 }}>
            Tags
          </Typography>
          <Box sx={{
            display: 'flex',
            flexWrap: "wrap",
            p: 0,
            mt: 1,
          }}>
            {
              assetDetailQry.data.detail!.tags?.map((tag, _index) => {
                return (
                  <Chip
                    key={tag.name} label={tag.name}
                    onClick={() => {
                      //handleTagClick(item.id)
                    }}
                    sx={{ m: .5, fontSize: 13 }} />
                )
              })
            }

          </Box>
        </Box>

        <Box sx={{ pt: 3 }}>
          <Typography variant="h6" color="text.secondary" sx={{ fontSize: 18 }}>
            Resource
          </Typography>
          <Box>
            {
              assetDetailQry.data.detail!.resources.length > 0 ?
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>Loading</Typography> // TODO: Downloadable component
                :
                <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>There is no downloadable file now.</Typography>
                </Box>
            }
          </Box>
        </Box>

      </Box>
    </Drawer >
  )
}