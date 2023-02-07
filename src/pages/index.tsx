import * as React from 'react';
import { modalItemData } from '../components/listItemData'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Image from 'next/image'
import img1 from '../public/images/p1.jpg'

export default function Home() {

  return (
    <ImageList sx={{ }} cols={3} rowHeight={164}>
      {modalItemData.map((item) => (
        <ImageListItem key={item.img}>
          <Image
            src={img1}
            alt={item.title}
            width="128" 
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>

  )
}