import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { experimentalStyled as styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';
import { useRecoilValue, useRecoilState } from 'recoil';
import { modelDrawerDisplayState, modelState } from '../atoms/fromTypes';

import { useRouter } from "next/router";
import useSWR from "swr";
import ModelDrawer from '../components/ModelDrawer';
import { AssetListItem, AssetDetails } from '../libs/types';
import { trpc } from '../utils/trpc'


function processInput<T>(input: T | T[] | undefined): string | number {
  if (Array.isArray(input)) {
    // 假設取第一個元素來處理
    input = input[0];
  }
  if (input === undefined) {
    return "undefined";
  }

  const numberValue = parseInt(input as unknown as string);

  if (isNaN(numberValue)) {
    return input as unknown as string;
  }

  return numberValue;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#202020' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  transition: '0.6s',
  cursor: "pointer",
  fontSize: "16px",
  border: '2px #202020 solid',
  '&:hover': {
    border: "2px grey solid",
    color: 'white'
  },
}));


export default function Home() {
  const [showDrawer, setShowDrawer] = useRecoilState(modelDrawerDisplayState);
  const router = useRouter();
  const { categoryId, assetId } = router.query;

  const safeCategoryId = processInput(categoryId);
  const safeAssetId = processInput(assetId);


  // const { data: assetListItems } = useSWR<AssetListItem[]>(categoryId ? [`/api/assets?cid=${categoryId}`] : null, fetcher);
  // const { data: assetDetails } = useSWR<AssetDetails>(assetId ? [`/api/assets/${assetId}`] : null, fetcher);
  const assetListQry = trpc.assets.list.useQuery({ categoryId: safeCategoryId as number });
  const assetDetailQry = trpc.assets.get.useQuery({ assetId: safeAssetId as string });
  const handleClick = (id: string) => {
    router.push({ pathname: '/home', query: { categoryId: id } }, undefined, { shallow: true });
  }
  // 暫時註解 若有需要再開
  // if(menuTreeId) {
  //   if(!mainOptionsListItem) return <div>Loading</div>
  //   console.log(mainOptionsListItem)
  //   return(
  //     <Box sx={{ flexGrow: 1 , p:5 }} >
  //       <Box>
  //         <Typography variant="h5" sx={{fontWeight:'bold', color:"#999"}}>
  //           Categories
  //         </Typography>
  //       </Box>
  //       <Grid container sx={{pt:5,px:1}} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
  //         {mainOptionsListItem.children.map((item,index) => {
  //           return(
  //               <Grid xs={2} sm={4} md={4} key={index}
  //                 sx={{
  //                    transition:'all 0.3s',
  //                    p:1.5
  //                 }}
  //                 onClick={() => handleClick(item.id)}
  //               >
  //                 <Item>{item.name}</Item>
  //               </Grid>
  //             )
  //           }
  //         )}
  //       </Grid>

  //     </Box>
  //   )
  // }

  //Loading
  if (assetListQry.isLoading) return (
    <Grid container wrap="nowrap" sx={{ mx: 2, my: 2 }}>
      <Box sx={{ width: '20%', marginRight: 1, my: 5 }}>
        <Skeleton variant="rounded" width='100%' height={220} />
      </Box>
      <Box sx={{ width: '20%', marginRight: 1, my: 5 }}>
        <Skeleton variant="rounded" width='100%' height={220} />
      </Box>
    </Grid>

  );
  return (
    <>
      {
        assetDetailQry.isSuccess && <ModelDrawer open={showDrawer} assetItem={assetDetailQry.data.detail} />
      }

      (<ImageList cols={5} gap={8} sx={{ mx: 2, my: 2 }} variant="standard" >
        <ImageListItem key="Subheader" cols={5}>
          <Typography variant="h5" sx={{ fontWeight: 'bolder', color: "#999", textTransform: "uppercase" }}>
            {assetListQry.data?.list[0]?.categoryName}
          </Typography>;
        </ImageListItem>
        {assetListQry.data.list.map((item, _index) => {
          return (
            <ImageListItem key={item.id}
              sx={{
                bgcolor: '#202020', p: 5, borderRadius: "5px", border: "2px #202020 solid", transition: 'all 0.3s', cursor: 'pointer',
                ':hover': {
                  border: "2px grey solid"
                },
                ':hover .MuiImageListItemBar-root': {
                  display: "block"
                }
              }}
              onClick={() => {
                router.query.assetId = item.id
                router.push(router)
                setTimeout(() => {
                  setShowDrawer(true);
                }, 500)

              }
              }
            >
              <img
                src={item.preview item.preview}
              alt={item.name}
              loading="lazy"
              style={{ borderRadius: "5px", objectFit: 'contain', aspectRatio: 1 / 1 }}

              />
              <ImageListItemBar
                title={item.name}
                position="bottom"
                sx={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
                    'rgba(0,0,0,0.3) 20%, rgba(0,0,0,0) 50%)',
                  display: 'none'
                }}
              />

            </ImageListItem>
          )
        }

        )}
      </ImageList>)
    </>


  )
}