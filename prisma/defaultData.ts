import { PrismaClient, Role, UserType, RepresentationFormat, RepresentationType, Category, Representation, Asset, Tag } from '@prisma/client'


export const defaultCategories = [
  { name: "2D Asset", parent: null, menu: "Home" },
  { name: "FX", parent: "2D Asset", menu: "Home" },
  { name: "3D Asset", parent: null, menu: "Home" },
  { name: "Accessories", parent: "3D Asset", menu: "Home" },
  { name: "Animal", parent: "3D Asset", menu: "Home" },
  { name: "Fish", parent: "Animal", menu: "Home" },
  { name: "Building", parent: "3D Asset", menu: "Home" },
  { name: "Char", parent: "3D Asset", menu: "Home" },
  { name: "Male", parent: "Char", menu: "Home" },
  { name: "Female", parent: "Char", menu: "Home" },
  { name: "Parts", parent: "Char", menu: "Home" },
  { name: "Indoor", parent: "3D Asset", menu: "Home" },
  { name: "Exterior", parent: "3D Asset", menu: "Home" },
  { name: "Naturel", parent: "3D Asset", menu: "Home" },
  { name: "Rocks", parent: "Naturel", menu: "Home" },
  { name: "Scene", parent: "3D Asset", menu: "Home" },
  { name: "Product", parent: "3D Asset", menu: "Home" },
  { name: "Weapon", parent: "3D Asset", menu: "Home" },
  { name: "3D Plants", parent: null, menu: "Home" },
  { name: "Bushes", parent: "3D Plants", menu: "Home" },
  { name: "Flower", parent: "3D Plants", menu: "Home" },
  { name: "Grass", parent: "3D Plants", menu: "Home" },
  { name: "Tree", parent: "3D Plants", menu: "Home" },
  { name: "Surfaces", parent: null, menu: "Home" },
  { name: "Brick", parent: "Surfaces", menu: "Home" },
  { name: "Concrete", parent: "Surfaces", menu: "Home" },
  { name: "Fabric", parent: "Surfaces", menu: "Home" },
  { name: "Ground", parent: "Surfaces", menu: "Home" },
  { name: "Lawn", parent: "Surfaces", menu: "Home" },
  { name: "Marble", parent: "Surfaces", menu: "Home" },
  { name: "Metal", parent: "Surfaces", menu: "Home" },
  { name: "Rock", parent: "Surfaces", menu: "Home" },
  { name: "Roofing", parent: "Surfaces", menu: "Home" },
  { name: "Sand", parent: "Surfaces", menu: "Home" },
  { name: "Snow", parent: "Surfaces", menu: "Home" },
  { name: "Soil", parent: "Surfaces", menu: "Home" },
  { name: "Stone", parent: "Surfaces", menu: "Home" },
  { name: "Tile", parent: "Surfaces", menu: "Home" },
  { name: "Wood", parent: "Surfaces", menu: "Home" },
  { name: "Other", parent: "Surfaces", menu: "Home" },
];

export const defaultAssets = [
  { category: "Accessories", name: "Hat", creator: 'admin' },
  { category: "Fish", name: "Fish 001", creator: 'admin' },
  { category: "Fish", name: "Fish 002", creator: 'admin' },
  { category: "Building", name: "Building 1", creator: 'admin' },
  { category: "Building", name: "Building 2", creator: 'admin' },
]

export const defaultRepresentations = [
  {
    name: "Fish 001 FBX texture",
    asset: "Fish 001",
    format: RepresentationFormat.IMG,
    type: RepresentationType.TEXTURE,
    uploader: 'admin',
    fileSize: 1233456789
  },
  {
    name: "Fish 001 FBX",
    asset: "Fish 001",
    format: RepresentationFormat.FBX,
    type: RepresentationType.MODEL,
    uploader: 'admin',
    texture: "Fish 001 FBX texture",
    fileSize: 1234456789
  },
  {
    name: "Fish 001 Preview",
    asset: "Fish 001",
    format: RepresentationFormat.IMG,
    type: RepresentationType.PREVIEW,
    uploader: 'admin',
  },
  {
    name: "Fish 002 FBX texture",
    asset: "Fish 002",
    format: RepresentationFormat.IMG,
    type: RepresentationType.TEXTURE,
    uploader: 'admin',
    fileSize: 1234456789
  },
  {
    name: "Fish 002 FBX",
    asset: "Fish 002",
    format: RepresentationFormat.FBX,
    type: RepresentationType.MODEL,
    uploader: 'admin',
    texture: "Fish 002 FBX texture",
    fileSize: 1234456789
  },
  {
    name: "Fish 002 Preview",
    asset: "Fish 002",
    format: RepresentationFormat.IMG,
    type: RepresentationType.PREVIEW,
    uploader: 'admin'
  },
]

export const defaultTags = [
  { name: 'asus', creator: 'admin', assets: ["Hat"] },
  { name: 'rog', creator: 'admin', assets: ["Hat"] },
  { name: 'taiwan', creator: 'admin', assets: ["Fish 001", "Fish 002"] },
  { name: "cyperpunk", creator: "admin", assets: ["Building 1"] },
  { name: "east", creator: "admin", assets: ["Building 2"] },
]

// source data
export const sourceItems = ["Fish 001", "Fish 002"]


// menu
export const defaultMenus = [
  { name: 'Home', iconName: "menu", sortOrder: 1, isVisible: true, isDeleted: false, isProtected: false },
  { name: 'Tags', iconName: "label", sortOrder: 2, isVisible: true, isDeleted: false, isProtected: false },
  { name: 'Favorite', iconName: "favorite", sortOrder: 3, isVisible: true, isDeleted: false, isProtected: true },
  { name: 'Download', iconName: "star", sortOrder: 4, isVisible: false, isDeleted: false, isProtected: true }]

