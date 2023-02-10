type ListItem = {
  id: string,
  title: string,
  iconname?: 'ViewModule' | 'Label',
  subitems?: { id: string, name: string }[]
}


export const mainList: ListItem[] = [
  {
    id: "1",
    title: "素材類別",
    iconname: "ViewModule",
    subitems: [
      {
        id: "素材類別-1",
        name: "3D Assets",
      },
      {
        id: "素材類別-2",
        name: "3D Plants",
      },
      {
        id: "素材類別-3",
        name: "Surfaces",
      }
    ]
  }
]

export const tagList: ListItem[] = [
  {
    id: "2",
    title: "標籤 TAGS",
    iconname: "Label",
    subitems: [
      {
        id: "標籤 TAGS-1",
        name: "3D Assets",
      },
      {
        id: "標籤 TAGS-2",
        name: "3D Plants",
      },
      {
        id: "標籤 TAGS-3",
        name: "Surfaces",
      },
      {
        id: "標籤 TAGS-4",
        name: "tag004",
      },
      {
        id: "標籤 TAGS-5",
        name: "tag005",
      }
    ]
  }
]
export const memberList = [
  {
    id: "1",
    title: "已下載",
  },
  {
    id: "2",
    title: "我的最愛",
  }
]

export const modalItemData2 = [
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/wldhdhxva/wldhdhxva_Thumb_HighPoly_thumb.jpg",
    title: "Breakfast",
    category: '3D assets',
    tages: [
      {
        slug: "string",
        uri: "string"
      }
    ],
    archives: {
      source: "http://"
    },
    publishedAt: "2023-02-10",
    author: "username"

  },
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/wdelca0/wdelca0_Thumb_HighPoly_thumb.jpg",
    title: "Tasty burger",
    category: '3D assets'
  },
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/wjvsbay/wjvsbay_Thumb_HighPoly_thumb.jpg",
    title: "Camera",
    category: '3D assets'
  },
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/wjehcjb/wjehcjb_Grid_360_thumb.jpg",
    title: "Morning",
    category: '3D assets'
  },
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/wj3keakqx/wj3keakqx_Thumb_HighPoly_thumb.jpg",
    title: "Hats",
    category: '3D assets'
  },
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/wj3keaaqx/wj3keaaqx_Thumb_HighPoly_thumb.jpg",
    title: "Honey",
    category: '3D assets'
  },
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/wffnebus/wffnebus_Thumb_HighPoly_thumb.jpg",
    title: "Vegetables",
    category: '3D assets'
  },
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/wd1xedc/wd1xedc_Thumb_HighPoly_thumb.jpg",
    title: "Mushrooms",
    category: '3D assets'
  },
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/vgkwebl/vgkwebl_Thumb_HighPoly_thumb.jpg",
    title: "Olive oil",
    category: '3D assets'
  },
  {
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/rmyxk/Grid_render_thumb_thumb.jpg",
    title: "Sea star",
    category: '3D assets'
  },
  {
    thumbnails: "https://ddinktqu5prvc.cloudfront.net/vjrgdcz/vjrgdcz_Thumb_HighPoly_thumb.jpg",
    title: "test Col2",
    category: '3D assets'
  }
];
