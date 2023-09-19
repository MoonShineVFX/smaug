import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { useRecoilValue, useRecoilState } from 'recoil';
import { modelDrawerDisplayState, modelState } from '../atoms/fromTypes';
import { useRouter } from "next/router";
import useSWR from "swr";
import { MenuListItem, MenuWithCategoriesResponse } from '../libs/types';
import { trpc } from '../utils/trpc';


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
export default function Index() {
  // const [currentModel, setCurrentModel] = useRecoilState(modelState);
  const model = useRecoilValue(modelState);
  const router = useRouter();
  const [menuId, setMenuId] = useState('');

  const handleClick = (id: number) => {
    router.push({ pathname: '/home', query: { categoryId: id } }, undefined, { shallow: true });
  }
  // const { data: menuListItems } = useSWR<MenuListItem[]>('/api/menus', fetcher);
  const menuListItemsQry = trpc.menus.all.useQuery();

  // const firstMenu = menuListItemsQry.data.menus[0]
  const menuTreeQry = trpc.menus.categories.useQuery({ menuId: menuId });

  useEffect(() => {
    if (menuListItemsQry.isSuccess && menuListItemsQry.data.menus.length > 0) {
      setMenuId(menuListItemsQry.data.menus[0].id); // 更新 state 變量
    }
  }, [menuListItemsQry.isSuccess, menuListItemsQry.data]);

  if (menuListItemsQry.error) {
    return (<div>Error!!</div>)
  }
  if (!menuListItemsQry.isSuccess) {
    return (<div>Loading</div>)
  }

  if (menuTreeQry.isLoading) return <div>Loading</div>
  if (menuTreeQry.error) return <div>Error</div>
  return (
    <>
      <Box sx={{ flexGrow: 1, p: 5 }} >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: "#999" }}>
            Categories
          </Typography>
        </Box>

        <Grid container sx={{ pt: 5 }} spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {menuTreeQry.data.menuTree.children.map((item, _index) => {
            return (
              <Grid xs={2} sm={4} md={4} key={item.id}
                sx={{
                  transition: 'all 0.3s',
                }}
                onClick={() => handleClick(item.id)}
              >
                <Item>{item.name}</Item>
              </Grid>
            )
          }
          )}
        </Grid>

      </Box>
    </>


  )
}