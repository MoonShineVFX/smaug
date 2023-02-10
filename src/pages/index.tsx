import * as React from 'react';
import { modalItemData,modalItemData2 } from '../components/listItemData'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import Image from 'next/image'
import img1 from '../public/images/p1.jpg'
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CloseIcon from '@mui/icons-material/Close';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {  useRecoilValue ,useRecoilState } from 'recoil';
import { modelDrawerDisplayState, modelState } from '../atoms/fromTypes';
export default function Home() {
  const [currentModel, setCurrentModel] = useRecoilState(modelState);
  const [showDrawer, setShowDrawer] = useRecoilState(modelDrawerDisplayState);
  const model = useRecoilValue(modelState);
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={showDrawer}
        variant="persistent"
        PaperProps={{
          sx:{ width:'25%'}
        }}
      > 
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
      </Toolbar>
        <Card sx={{  }}>
          <CardActions>
            <IconButton aria-label="close" onClick={()=>setShowDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </CardActions>
            <CardMedia
              component="img"
              height="280"
              image={model?.thumbnails}
              alt={model?.thumbnails}
              sx={{objectFit:"contain", bgcolor:"#202020" , p:2}}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {model?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {model?.category}
              </Typography>
            </CardContent>

        </Card>


        <Box sx={{p:2}}>
          data info 
        </Box>
        <Box sx={{display:'flex',position:'absolute',bottom:0,width:'100%',justifyContent:'center', p:2, bgcolor:"#202020"}}>
          <Button variant="contained" sx={{m:1, width: .5}}>Download</Button>
        </Box>
        
      </Drawer>
      <ImageList sx={{}}  cols={5} gap={8}  sx={{mx:2 , my:2}} variant="standad" >
        <ImageListItem key="Subheader" cols={5}>
          <ListSubheader component="div">3D Assets</ListSubheader>
        </ImageListItem>
        {modalItemData2.map((item) => {
          return(
            <ImageListItem key={item.thumbnails} 
              sx={{
                bgcolor:'#202020', p:5,borderRadius: "5px",border:"2px #202020 solid", transition:'all 0.3s',
                ':hover':{
                  border:"2px grey solid"
                } 
              }}
              onClick={()=>{
                  setShowDrawer(true);
                  setCurrentModel(item);
                }
              }
            
            >

            <img
              src={item.thumbnails}
              alt={item.title}
              loading="lazy"
              style={{borderRadius: "5px" , objectFit:'contain', aspectRatio:1/1  }}
              
            />
            <ImageListItemBar
              title={item.title}
            />

            </ImageListItem>
          )
        }
          
      )}
      </ImageList>
    </>


  )
}