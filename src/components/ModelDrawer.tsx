import React, { useState, useEffect } from 'react';
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
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import { useRouter } from "next/router";
import { useRecoilState } from 'recoil';
import { modelDrawerDisplayState } from '../atoms/fromTypes';
import { styled } from "@mui/material/styles";

import { AssetDetailOutput } from '../libs/types';

interface IModelDrawerProps {
  assetItem: AssetDetailOutput;
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


export default function ModelDrawer({ assetItem, openDrawer, setOpenDrawer }: IModelDrawerProps) {
  // const [showDrawer, setShowDrawer] = useRecoilState(modelDrawerDisplayState);
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  if (!assetItem) {
    setOpenDrawer(false)
    return <></>
  }
  console.log(assetItem)

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
          <CardMedia
            component="img"
            height="280"
            image={assetItem?.preview === "" ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/No_image_available_500_x_500.svg/1200px-No_image_available_500_x_500.svg.png' : assetItem?.preview}
            alt={assetItem?.name}
            sx={{ objectFit: "contain", bgcolor: "#202020", p: 2 }}
          />
          <Box sx={{ position: 'absolute', width: '100%', px: 2, top: '10px', display: 'flex', justifyContent: "space-between" }}>
            <ButtonGroup
              variant="contained"
              color="primary"
              size="small"
            >
              <ViewIconButton isActive={isActive} onClick={() => setIsActive(!isActive)} ><ImageOutlinedIcon fontSize="small" /></ViewIconButton>
              {assetItem?.renders.length > 0 && <ViewIconButton ><ViewInArOutlinedIcon fontSize="small" /></ViewIconButton>}
            </ButtonGroup>
            <IconButton aria-label="close" onClick={() => {
              setOpenDrawer(false)
              setTimeout(() => {
                router.query.assetId = [];
                router.push(router)
              }, 500)

            }}>
              <CloseIcon />
            </IconButton>
          </Box>
          {
            assetItem?.renders.length > 0 ?
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>Loading</Typography>
              :
              <Box sx={{ position: 'absolute', width: '100%', px: 2, bottom: '10px', display: 'flex', justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>Render Images : 0</Typography>
              </Box>
          }
        </div>

        <CardContent sx={{ backgroundColor: '#333', px: 3 }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bolder', textTransform: 'uppercase', mb: 0 }}>
            {assetItem?.name}


          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: '', letterSpacing: '', fontSize: 13 }}>
            {assetItem?.categoryList?.replace(/\\/g, " > ").slice(0, -2)}
          </Typography>


        </CardContent>

      </Card>


      <Box sx={{ p: 3 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>
            Created at {assetItem?.createAt?.toLocaleString().substr(0, 10)} by {assetItem?.creator}
          </Typography>
        </Box>

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
              assetItem?.tags?.map((item, index) => {
                return (
                  <Chip
                    key={item.name} label={item.name}
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
              assetItem?.downloads.length > 0 ?
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>Loading</Typography>
                :
                <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, textAlign: 'right' }}>There is no downloadable file now.</Typography>
                </Box>
            }

          </Box>
        </Box>

      </Box>
    </Drawer>
  )
}