import React, { useMemo, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import { Theme } from '@mui/material/styles';
import { experimentalStyled as styled } from '@mui/material/styles';
import { useRecoilState } from 'recoil';
import { modelDrawerDisplayState } from '../atoms/fromTypes';
import { useRouter } from "next/router";
import { CircularIndeterminate, EmptyState } from '../components/basic';
import ModelDrawer from '../components/ModelDrawer';
import { trpc } from '../utils/trpc'
import { zodInputStringPipe } from '../utils/util';
import { z } from 'zod';

const drawerWidth = 240;

const transitionStyles = (theme: Theme) => theme.transitions.create(['marginRight'], {
  easing: theme.transitions.easing.sharp,
  duration: theme.transitions.duration.enteringScreen,
});

const AssetListItem = styled(ImageListItem)(({ theme }) => ({
  backgroundColor: '#202020',
  padding: theme.spacing(5),
  borderRadius: '5px',
  border: '2px #202020 solid',
  transition: 'all 0.3s',
  cursor: 'pointer',
  '&:hover': {
    border: '2px grey solid',
  },
  '&:hover .MuiImageListItemBar-root': {
    display: 'block',
  },
}));


const querySchema = z.object({
  categoryId: zodInputStringPipe(z.coerce.number()),
  assetId: z.string().default(''),
})

export default function Home() {
  const [showAssetDrawer, setShowAssetDrawer] = useState(false);
  const router = useRouter();

  const safeQuery = useMemo(() => {
    const result = querySchema.safeParse(router.query);

    if (result.success) {
      return result.data;
    }

    return undefined
  }, [router.query])


  const assetListQry = trpc.assets.list.useQuery({ categoryId: safeQuery!.categoryId }, { enabled: !!safeQuery });
  // const assetDetailQry = trpc.assets.get.useQuery({ assetId: safeQuery!.assetId }, { enabled: !!safeQuery });


  //Loading
  if (assetListQry.isLoading) {
    return <CircularIndeterminate />
  };

  //No Asset, 給一個找不到 item 的 empty Component
  if (assetListQry.isSuccess && assetListQry.data.list.length === 0) {
    return <EmptyState />
  }


  return (
    <>
      {
        <ModelDrawer openDrawer={showAssetDrawer} setOpenDrawer={setShowAssetDrawer} assetId={safeQuery!.assetId} />
      }

      <ImageList
        cols={5}
        gap={8}
        sx={{
          mx: 2,
          my: 2,
          marginRight: showAssetDrawer ? 62 : 2,
          transition: transitionStyles,
        }} variant="quilted" >  {/*todo:  add smooth transition*/}
        <ImageListItem
          key="Subheader"
          cols={5}
          sx={{
            transition: (theme) => theme.transitions.create(['gridColumnEnd', 'gridColumnStart'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bolder', color: "#999", textTransform: "uppercase" }}>
            {assetListQry.data?.list[0]?.categoryName}
          </Typography>;
        </ImageListItem>
        {assetListQry.data?.list.map((item, _index) => {
          return (
            <AssetListItem key={item.id}
              onClick={() => {
                router.query.assetId = item.id
                router.push(router)
                setTimeout(() => {
                  setShowAssetDrawer(true);
                }, 500)
              }}
            >
              <img src={item.preview}
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
            </AssetListItem>
          )
        })}
      </ImageList>
    </>
  )
}