//這邊都是假資料用途
interface ListItem {
  id: string;
  name: string;
  iconName: string;
  children: {}[]
}
export const mainList: ListItem[] = [
  {
    id: "1",
    name: "素材類別",
    iconName: "ViewModule",
    children: [
      {
        id: "a1",
        name: "3D Assets",
        children: [
          {
            id: "a1-1",
            name: "Building",
            children: [
              {
                id: "a1-1-1",
                name: "Balcony",
                children: []
              },
              {
                id: "a1-1-2",
                name: "Beam",
                children: []
              },
              {
                id: "a1-1-3",
                name: "Combined",
                children: []
              },
              {
                id: "a1-1-4",
                name: "A1234",
                children: []
              }
            ]
          },
          {
            id: "a2",
            name: "Food",
            children: []
          },
          {
            id: "a3",
            name: "Historical",
            children: []
          },
          {
            id: "a4",
            name: "Industrial",
            children: []
          },
          {
            id: "a5",
            name: "Interior",
            children: []
          }

        ]
      },
      {
        id: "2",
        name: "3D Plants",
        children: []
      },
      {
        id: "3",
        name: "Surfaces",
        children: []
      }
    ]
  }
]

export const tagList: ListItem[] = [
  {
    id: "2",
    name: "標籤 TAGS",
    iconName: "Label",
    children: [
      {
        id: "1",
        name: "3D Assets",
      },
      {
        id: "2",
        name: "3D Plants",
      },
      {
        id: "3",
        name: "Surfaces",
      },
      {
        id: "3",
        name: "tag004",
      },
      {
        id: "3",
        name: "tag005",
      }
    ]
  }
]
export const memberList = [
  {
    id: "1",
    name: "已下載",
  },
  {
    id: "2",
    name: "我的最愛",
  }
]


export const menuList = [
  {
    id: "menu1",
    iconName: "ViewModule",
    name: "Home",
  },
  {
    id: "menu2",
    iconName: "ViewModule",
    name: "Tags",
  },
  {
    id: "menu",
    iconName: "ViewModule",
    name: ""
  }
]


export const modalItemData2 = [
  {
    id: "as-1",
    name: "Tasty burger",
    thumbnails: "https://ddinktqu5prvc.cloudfront.net/wjvsbay/wjvsbay_Thumb_HighPoly_thumb.jpg",
    category: '3D assets',
    updateAt: null,
    createAt: "2023-02-10"
  },
  {
    id: "as-2",
    name: "Tasty burger",
    thumbnails: "https://ddinktqu5prvc.cloudfront.net/wjvsbay/wjvsbay_Thumb_HighPoly_thumb.jpg",
    category: '3D assets',
    updateAt: null,
    createAt: "2023-02-10"
    // },
    // {
    //   id: "as-3",
    //   thumbnails:
    //     "https://ddinktqu5prvc.cloudfront.net/wjvsbay/wjvsbay_Thumb_HighPoly_thumb.jpg",
    //   name: "Camera",
    //   category: '3D assets'
    // },
    // {
    //   id: "as-4",
    //   thumbnails:
    //     "https://ddinktqu5prvc.cloudfront.net/wjehcjb/wjehcjb_Grid_360_thumb.jpg",
    //   name: "Morning",
    //   category: '3D assets'
    // },
    // {
    //   id: "as-5",
    //   thumbnails:
    //     "https://ddinktqu5prvc.cloudfront.net/wj3keakqx/wj3keakqx_Thumb_HighPoly_thumb.jpg",
    //   name: "Hats",
    //   category: '3D assets'
    // },
    // {
    //   id: "as-6",
    //   thumbnails:
    //     "https://ddinktqu5prvc.cloudfront.net/wj3keaaqx/wj3keaaqx_Thumb_HighPoly_thumb.jpg",
    //   name: "Honey",
    //   category: '3D assets'
    // },
    // {
    //   id: "as-7",
    //   thumbnails:
    //     "https://ddinktqu5prvc.cloudfront.net/wffnebus/wffnebus_Thumb_HighPoly_thumb.jpg",
    //   name: "Vegetables",
    //   category: '3D assets'
    // },
    // {
    //   id: "as-8",
    //   thumbnails:
    //     "https://ddinktqu5prvc.cloudfront.net/wd1xedc/wd1xedc_Thumb_HighPoly_thumb.jpg",
    //   name: "Mushrooms",
    //   category: '3D assets'
    // },
    // {
    //   id: "as-9",
    //   thumbnails:
    //     "https://ddinktqu5prvc.cloudfront.net/vgkwebl/vgkwebl_Thumb_HighPoly_thumb.jpg",
    //   name: "Olive oil",
    //   category: '3D assets'
    // },
    // {
    //   id: "as-10",
    //   thumbnails:
    //     "https://ddinktqu5prvc.cloudfront.net/rmyxk/Grid_render_thumb_thumb.jpg",
    //   name: "Sea star",
    //   category: '3D assets'
    // },
    // {
    //   id: "as-11",
    //   thumbnails: "https://ddinktqu5prvc.cloudfront.net/vjrgdcz/vjrgdcz_Thumb_HighPoly_thumb.jpg",
    //   name: "test Col2",
    //   category: '3D assets'
  }
];


const assetDetails = [
  {
    id: "cat-1",
    thumbnails:
      "https://ddinktqu5prvc.cloudfront.net/wldhdhxva/wldhdhxva_Thumb_HighPoly_thumb.jpg",
    name: "Breakfast",
    categorylist: '3D assets\sexygirl\\',
    tages: [
      { id: "tags-1", name: "Rog" },
      { id: "tags-2", name: "Taiwan" },
    ],
    renders: [
      { id: "as-1-render-1", name: "Render Size", value: "1920x1080", url: "https://ddinktqu5prvc.cloudfront.net/wldhdhxva/wldhdhxva_Thumb_HighPoly_thumb.jpg" },
      { id: "as-1-render-2", name: "Render Size", value: "1920x1080", url: "https://ddinktqu5prvc.cloudfront.net/wldhdhxva/wldhdhxva_Thumb_HighPoly_thumb.jpg" },
    ],
    downloads: [
      [
        { id: "poiuyt", name: 'asset-1 高模', format: "FBX", diskUsage: "1.1 GB" },
        { id: "lkjhhg", name: 'asset-1 高模貼圖)', format: "IMG", diskUsage: 2233456789, size: "2K" }
      ],
      [
        { id: "asdfde", name: 'asset-1 中模', format: "FBX", diskUsage: "1.1 GB" },
        { id: "lkjhhg", name: 'asset-1 中模貼圖)', format: "IMG", diskUsage: 1233456789, size: "1K" }
      ]
    ],
    publishedAt: "2023-02-10",
    author: "username"
  }]

  // export const representationJsonSchema = {
  //   preview: [],
  //   render: ["Render Size", "Renderer"],
  //   model: ["Vertext Count", "Face Count", "Bone Count", "Texture Count"],
  //   texture: ["Texture Size", "Texture Format"],
  // }