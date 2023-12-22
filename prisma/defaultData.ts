import { PrismaClient, Role, UserType, RepresentationFormat, RepresentationType, Category, Representation, Asset, Tag } from '@prisma/client'


export const defaultCategories = [
  { id: 1, path: "/1", name: "No Category", parent: null, menu: "Home" },
  { id: 2, path: "/2", name: "2D Asset", parent: null, menu: "Home" },
  { id: 3, path: "/2/3", name: "FX", parent: "2D Asset", menu: "Home" },
  { id: 4, path: "/4", name: "3D Asset", parent: null, menu: "Home" },
  { id: 5, path: "/4/5", name: "Accessories", parent: "3D Asset", menu: "Home" },
  { id: 6, path: "/4/6", name: "Animal", parent: "3D Asset", menu: "Home" },
  { id: 7, path: "/4/6/7", name: "Fish", parent: "Animal", menu: "Home" },
  { id: 8, path: "/4/8", name: "Building", parent: "3D Asset", menu: "Home" },
  { id: 9, path: "/4/9", name: "Char", parent: "3D Asset", menu: "Home" },
  { id: 10, path: "/4/9/10", name: "Male", parent: "Char", menu: "Home" },
  { id: 11, path: "/4/9/11", name: "Parts", parent: "Char", menu: "Home" },
  { id: 12, path: "/4/12", name: "Indoor", parent: "3D Asset", menu: "Home" },
  { id: 13, path: "/4/13", name: "Exterior", parent: "3D Asset", menu: "Home" },
  { id: 14, path: "/4/14", name: "Naturel", parent: "3D Asset", menu: "Home" },
  { id: 15, path: "/4/14/15", name: "Rocks", parent: "Naturel", menu: "Home" },
  { id: 16, path: "/4/16", name: "Scene", parent: "3D Asset", menu: "Home" },
  { id: 17, path: "/4/17", name: "Product", parent: "3D Asset", menu: "Home" },
  { id: 18, path: "/4/18", name: "Weapon", parent: "3D Asset", menu: "Home" },
  { id: 19, path: "/19", name: "3D Plants", parent: null, menu: "Home" },
  { id: 20, path: "/19/20", name: "Bushes", parent: "3D Plants", menu: "Home" },
  { id: 21, path: "/19/21", name: "Flower", parent: "3D Plants", menu: "Home" },
  { id: 22, path: "/19/22", name: "Grass", parent: "3D Plants", menu: "Home" },
  { id: 23, path: "/19/23", name: "Tree", parent: "3D Plants", menu: "Home" },
  { id: 24, path: "/24", name: "Surfaces", parent: null, menu: "Home" },
  { id: 25, path: "/24/25", name: "Brick", parent: "Surfaces", menu: "Home" },
  { id: 26, path: "/24/26", name: "Concrete", parent: "Surfaces", menu: "Home" },
  { id: 27, path: "/24/27", name: "Fabric", parent: "Surfaces", menu: "Home" },
  { id: 28, path: "/24/28", name: "Ground", parent: "Surfaces", menu: "Home" },
  { id: 29, path: "/24/29", name: "Lawn", parent: "Surfaces", menu: "Home" },
  { id: 30, path: "/24/30", name: "Marble", parent: "Surfaces", menu: "Home" },
  { id: 31, path: "/24/31", name: "Metal", parent: "Surfaces", menu: "Home" },
  { id: 32, path: "/24/32", name: "Rock", parent: "Surfaces", menu: "Home" },
  { id: 33, path: "/24/33", name: "Roofing", parent: "Surfaces", menu: "Home" },
  { id: 34, path: "/24/34", name: "Sand", parent: "Surfaces", menu: "Home" },
  { id: 35, path: "/24/35", name: "Snow", parent: "Surfaces", menu: "Home" },
  { id: 36, path: "/24/36", name: "Soil", parent: "Surfaces", menu: "Home" },
  { id: 37, path: "/24/37", name: "Stone", parent: "Surfaces", menu: "Home" },
  { id: 38, path: "/24/38", name: "Tile", parent: "Surfaces", menu: "Home" },
  { id: 39, path: "/24/39", name: "Wood", parent: "Surfaces", menu: "Home" },
  { id: 40, path: "/24/40", name: "Other", parent: "Surfaces", menu: "Home" },
];


// export const defaultAssets = [
//   { category: "Accessories", name: "Hat", creator: 'admin' },
//   { category: "Fish", name: "Fish 001", creator: 'admin' },
//   { category: "Fish", name: "Fish 002", creator: 'admin' },
//   { category: "Building", name: "Building 1", creator: 'admin' },
//   { category: "Building", name: "Building 2", creator: 'admin' },
// ]

// export const defaultRepresentations = [
//   {
//     name: "Fish 001 FBX texture",
//     asset: "Fish 001",
//     format: RepresentationFormat.IMG,
//     type: RepresentationType.TEXTURE,
//     uploader: 'admin',
//     fileSize: 1233456789
//   },
//   {
//     name: "Fish 001 FBX",
//     asset: "Fish 001",
//     format: RepresentationFormat.FBX,
//     type: RepresentationType.MODEL,
//     uploader: 'admin',
//     texture: "Fish 001 FBX texture",
//     fileSize: 1234456789
//   },
//   {
//     name: "Fish 001 Preview",
//     asset: "Fish 001",
//     format: RepresentationFormat.IMG,
//     type: RepresentationType.PREVIEW,
//     uploader: 'admin',
//   },
//   {
//     name: "Fish 002 FBX texture",
//     asset: "Fish 002",
//     format: RepresentationFormat.IMG,
//     type: RepresentationType.TEXTURE,
//     uploader: 'admin',
//     fileSize: 1234456789
//   },
//   {
//     name: "Fish 002 FBX",
//     asset: "Fish 002",
//     format: RepresentationFormat.FBX,
//     type: RepresentationType.MODEL,
//     uploader: 'admin',
//     texture: "Fish 002 FBX texture",
//     fileSize: 1234456789
//   },
//   {
//     name: "Fish 002 Preview",
//     asset: "Fish 002",
//     format: RepresentationFormat.IMG,
//     type: RepresentationType.PREVIEW,
//     uploader: 'admin'
//   },
// ]

export const defaultTags = [
  { name: 'asus', creator: 'admin', assets: ["Hat"] },
  { name: 'rog', creator: 'admin', assets: ["Hat"] },
  { name: 'taiwan', creator: 'admin', assets: ["Fish 001", "Fish 002"] },
  { name: "cyperpunk", creator: "admin", assets: ["Building 1"] },
  { name: "east", creator: "admin", assets: ["Building 2"] },
]

// source data
// export const sourceItems = ["Fish 001", "Fish 002"]


// menu
export const defaultMenus = [
  { name: 'Home', iconName: "menu", sortOrder: 1, isVisible: true, isDeleted: false, isProtected: false },
  { name: 'Resources', iconName: "PublishedWithChanges", sortOrder: 2, isVisible: true, isDeleted: false, isProtected: false },
  { name: 'Tags', iconName: "label", sortOrder: 3, isVisible: true, isDeleted: false, isProtected: false },
  { name: 'Favorite', iconName: "favorite", sortOrder: 4, isVisible: true, isDeleted: false, isProtected: true },
  { name: 'Download', iconName: "star", sortOrder: 5, isVisible: false, isDeleted: false, isProtected: true }]
