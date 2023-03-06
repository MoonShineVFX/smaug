import React,{ useState, useEffect } from 'react';
import { styled, ThemeProvider, createTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Box, { BoxProps } from '@mui/material/Box';
import { mainList, memberList, tagList } from './listItemData'
import { MdViewModule, MdLabel, } from 'react-icons/md';
import * as FontAwesome from "react-icons/fa";
import { useRouter } from "next/router";
import { fetchData } from '../libs/client/fetchFunction';
import useSWR from "swr";
import Icon from '@mui/material/Icon';
import NextLink from 'next/link'
import { Link as MUILink } from '@mui/material';
const fetcher = (url) => fetch(url).then((r) => r.json());
interface typesListData {
    id: string;
    title: string;
    iconname?: 'ViewModule' | 'Label';
    subitems?: { id: string, name: string }[]
}


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
  child?:IChild[],
  open?: boolean;
  isVisible?:boolean |  undefined;
}
interface IChild {
  id: string;
  name: string;
  children?: IChild[];
}
const CollapseTree = ({child,open,isVisible}:ICollapseTree)=>{
  const router = useRouter();
  const [subOpen, setSubOpen] = React.useState('');
  const handleClick = (id:string) => {
    if(subOpen === id){
      setSubOpen('')
      return
    }
    router.push({pathname: '/home' , query: {categoryId:id} }, undefined, { shallow: true });
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
                {subOpen === child.id ? <CollapseTree child={child.children} open={true} isVisible={subOpen} /> : <></>}
              </Box>

            )
          })
        }

      </List>
    </Collapse>

  )
}
interface ICustomListWithCollapse {
  mainMenuData?: ImainMenuData
}
interface ImainMenuData {
  id: string;
  name: string;
}
interface IListItem {
  iconName: string;
  name: string;
  children: any[];
  message?: string;
}
const CustomListWithCollapse = ({ mainMenuData }: ICustomListWithCollapse) => {
  const [open, setOpen] = useState(true);
  const handleClick = () => {
    setOpen(!open);
  };
  const { data: mainOptionsListItem } = useSWR(mainMenuData ? [`/api/menuTree?id=${mainMenuData.id}` ] : null, fetcher);
  // useEffect(()=>{
  //   async function getItems() {
  //     const items = await fetchData(`/api/menuTree?id=${mainMenuData?.id}`);
  //     console.log(items)
  //     setListItem(items);
  //   }
  //   getItems()
  // },[mainMenuData])
  if (!mainOptionsListItem) return <div>Loading</div>
  return (
    <>
     {
      mainOptionsListItem.message === 'Menu Categories not found' ? 
      <></>
      :
      <CustomerNav >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon >
            <Icon>{mainOptionsListItem.iconName}</Icon>
          </ListItemIcon>

            <ListItemText primary={mainOptionsListItem.name} />
            {/* <NextLink href={`${mainOptionsListItem.name.toLowerCase()}?menuTreeId=${mainOptionsListItem.id}`} passHref style={{ textDecoration: 'none' }}>
                <MUILink variant="body2"  underline="none" sx={{color:'white',fontSize:'1rem'}} >{mainOptionsListItem.name}</MUILink>
            </NextLink> */}
          
        </ListItemButton>
        <CollapseTree child={mainOptionsListItem.children} open={open} isVisible={false} /> 
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
  const handleTagClick = (id) => {
    console.log('click')
    router.push({pathname: '/tags' , query: {id} }, undefined, { shallow: true });
  }
  const { data: mainOptionsListItem } = useSWR(mainMenuData ? [`/api/tags` ] : null, fetcher);

  if (!mainOptionsListItem) return <div>Loading</div>
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
              mainOptionsListItem.map((item, index) => {
                return (
                  <Chip key={item.name} label={item.name} onClick={()=>handleTagClick(item.id)} sx={{ m: .5, fontSize: '12px' }} />
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
export const MainListItems = ({mainMenuData}: IMainListItems) => {
  return (

      <CustomListWithCollapse mainMenuData={mainMenuData}  />
 
  );
}
interface ITagListItems {
  mainMenuData?: ImainMenuData
}
export const TagListItems = ({mainMenuData}: ITagListItems) => {

  return (

      <CustomListWithCollapseForTag mainMenuData={mainMenuData}  />

  );
}

export const MemberListItems = () => {
  return (
    <CustomerNav>
      <ListSubheader component="div" inset>
        會員功能（如有登入)
      </ListSubheader>
      {
        memberList.map((item, index) => {
          return (
            <ListItemButton key={index}>
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          )
        })
      }
    </CustomerNav>
  )
}