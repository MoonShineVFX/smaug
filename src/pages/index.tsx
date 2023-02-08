import * as React from 'react';
import { modalItemData,modalItemData2 } from '../components/listItemData'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import Image from 'next/image'
import img1 from '../public/images/p1.jpg'
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
export default function Home() {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  return (
    <>
      <Drawer
        anchor="right"
        open={open}
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
        <img src="https://ddinktqu5prvc.cloudfront.net/rmyxk/Grid_render_thumb_thumb.jpg" alt="" />
        <div>Sea star</div>
        <div>title</div>
        <div>tag</div>
        <div>tag</div>
        <div>tag</div>
        <div>tag</div>
        <div>tag</div>
        
      </Drawer>
      <ImageList sx={{}}  cols={4} gap={8}  sx={{mx:2 , my:2}} variant="standad" >
        <ImageListItem key="Subheader" cols={4}>
          <ListSubheader component="div">3D Assets</ListSubheader>
        </ImageListItem>
        {modalItemData2.map((item) => {
          return(
            <ImageListItem key={item.img} 
              sx={{
                bgcolor:'#202020', p:5,borderRadius: "5px",border:"2px #202020 solid", transition:'all 0.3s',
                ':hover':{
                  border:"2px grey solid"
                } 
              }}
              onClick={toggleDrawer}
            
            >

            <img
              src={item.img}
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