import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

import { MdViewModule, MdLabel, } from 'react-icons/md';
import { useRouter } from "next/router";
import Icon from '@mui/material/Icon';
import { trpc } from '../utils/trpc';


// const fetcher = (url: string) => fetch(url).then((r) => r.json());


// interface typesListData {
//   id: string;
//   title: string;
//   iconname?: 'ViewModule' | 'Label';
//   subitems?: { id: string, name: string }[]
// }


const components = {
  MdViewModule,
  MdLabel,
}
const CustomerNav = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
  '& .MuiCollapse-root': {
    marginLeft: 16,
  }
});
interface ICollapseTree {
  child?: IChild[],
  open?: boolean;
  isVisible?: boolean | undefined;
}
interface IChild {
  id: number;
  name: string;
  children?: IChild[];
}
const CollapseTree = ({ child, open, isVisible }: ICollapseTree) => {
  const router = useRouter();
  const [subOpen, setSubOpen] = useState(0);
  const handleClick = (id: number) => {
    if (subOpen === id) {
      setSubOpen(id)
      return
    }
    router.push({ pathname: '/home', query: { categoryId: id } }, undefined, { shallow: true });
    setSubOpen(id)
  }
  return (

    <Collapse in={open} timeout="auto" unmountOnExit>
      <List component="div" disablePadding sx={{ my: 0 }}>
        {
          child?.map((child, index) => {
            return (
              <Box component="div" key={child.id} >
                <ListItemButton
                  sx={{
                    pl: 2, py: 0,
                    ':hover': {
                      color: 'white'
                    },
                    ...(subOpen === child.id ? {
                      color: 'white'
                    } : { color: 'grey' })
                  }}
                  onClick={() => handleClick(child.id)}
                >
                  <ListItemText primary={child.name} />
                </ListItemButton>
                {subOpen === child.id ? <CollapseTree child={child.children} open={true} isVisible={Boolean(subOpen)} /> : <></>}
              </Box>
            )
          })
        }
      </List>
    </Collapse>

  )
}
interface ICustomListWithCollapse {
  mainMenuData: ImainMenuData
}
interface ImainMenuData {
  id: string;
  name: string;
}
// interface IListItem {
//   iconName: string;
//   name: string;
//   children: any[];
//   message?: string;
// }
const CustomListWithCollapse = ({ mainMenuData }: ICustomListWithCollapse) => {
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const menuTreeQry = trpc.menus.categories.useQuery({ menuId: mainMenuData.id });

  if (menuTreeQry.isLoading) return <div>menuTreeQry-Loading</div>
  if (menuTreeQry.isError) return <div>{menuTreeQry.error.message}</div>
  return (
    <>
      {
        menuTreeQry.isSuccess &&
        <CustomerNav >
          <ListItemButton onClick={handleClick}>
            <ListItemIcon >
              <Icon>{menuTreeQry.data.menuTree.iconName}</Icon>
            </ListItemIcon>

            <ListItemText primary={menuTreeQry.data.menuTree.name} />
            {/* <NextLink href={`${mainOptionsListItem.name.toLowerCase()}?menuTreeId=${mainOptionsListItem.id}`} passHref style={{ textDecoration: 'none' }}>
                <MUILink variant="body2"  underline="none" sx={{color:'white',fontSize:'1rem'}} >{mainOptionsListItem.name}</MUILink>
            </NextLink> */}

          </ListItemButton>
          <CollapseTree child={menuTreeQry.data.menuTree.children} open={open} isVisible={false} />
        </CustomerNav>
      }
    </>
  )
}

interface ICustomListWithCollapseForTag {
  mainMenuData?: ImainMenuData
}
interface ITagsListItem {
  id: string;
  name: string;
}

const CustomListWithCollapseForTag = ({ mainMenuData }: ICustomListWithCollapseForTag) => {
  const [open, setOpen] = React.useState(true);
  const router = useRouter();
  const [listItem, setListItem] = useState<ITagsListItem[]>([]);
  const handleClick = () => {
    setOpen(!open);
  };
  const handleTagClick = (id: string) => {
    console.log('click')
    router.push({ pathname: '/tags', query: { id } }, undefined, { shallow: true });
  }
  // const { data: mainOptionsListItem } = useSWR(mainMenuData ? [`/api/tags`] : null, fetcher);
  const tagsQry = trpc.tags.list.useQuery();

  if (tagsQry.isLoading) return <div>Loading Tags...</div>
  if (tagsQry.isError) return <div>{tagsQry.error.message}</div>
  return (
    <CustomerNav>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <Icon>label</Icon>
        </ListItemIcon>
        <ListItemText primary={'Tags'} />
      </ListItemButton>
      {

        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{
            display: 'flex',
            flexWrap: "wrap",
            p: 1,
            m: 1,
          }}>
            {
              tagsQry.data?.list.map((item, _index) => {
                return (
                  <Chip key={item.name} label={item.name} onClick={() => handleTagClick(item.id)} sx={{ m: .5, fontSize: '12px' }} />
                )
              })
            }

          </Box>
        </Collapse>
      }

    </CustomerNav>
  )
}
interface IMainListItems {
  mainMenuData?: ImainMenuData
}
export const MainListItems = ({ mainMenuData }: IMainListItems) => {
  return (
    mainMenuData ?
      <CustomListWithCollapse mainMenuData={mainMenuData} /> :
      <></>
  );
}
interface ITagListItems {
  mainMenuData?: ImainMenuData
}
export const TagListItems = ({ mainMenuData }: ITagListItems) => {

  return (

    <CustomListWithCollapseForTag mainMenuData={mainMenuData} />

  );
}

// export const MemberListItems = () => {
//   return (
//     <CustomerNav>
//       <ListSubheader component="div" inset>
//         會員功能（如有登入)
//       </ListSubheader>
//       {
//         memberList.map((item, index) => {
//           return (
//             <ListItemButton key={index}> 
//               <ListItemIcon>
//                 <AssignmentIcon />
//               </ListItemIcon>
//               <ListItemText primary={item.title} />
//             </ListItemButton>
//           )
//         })
//       }
//     </CustomerNav>
//   )
// }