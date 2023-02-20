import { PrismaClient, Role, UserType, RepresentationFormat, RepresentationType, Category, Representation, Asset, Tag } from '@prisma/client'


export const defaultCategories = [
  { name: "2D Asset", parent: "Root" },
  { name: "FX", parent: "2D Asset" },
  { name: "3D Asset", parent: "Root" },
  { name: "Accessories", parent: "3D Asset" },
  { name: "Animal", parent: "3D Asset" },
  { name: "Fish", parent: "Animal" },
  { name: "Building", parent: "3D Asset" },
  { name: "Char", parent: "3D Asset" },
  { name: "Male", parent: "Char" },
  { name: "Female", parent: "Char" },
  { name: "Parts", parent: "Char" },
  { name: "Indoor", parent: "3D Asset" },
  { name: "Exterior", parent: "3D Asset" },
  { name: "Naturel", parent: "3D Asset" },
  { name: "Rocks", parent: "Naturel" },
  { name: "Scene", parent: "3D Asset" },
  { name: "Product", parent: "3D Asset" },
  { name: "Weapon", parent: "3D Asset" },
  { name: "3D Plants", parent: "Root" },
  { name: "Bushes", parent: "3D Plants" },
  { name: "Flower", parent: "3D Plants" },
  { name: "Grass", parent: "3D Plants" },
  { name: "Tree", parent: "3D Plants" },
  { name: "Surfaces", parent: "Root" },
  { name: "Brick", parent: "Surfaces" },
  { name: "Concrete", parent: "Surfaces" },
  { name: "Fabric", parent: "Surfaces" },
  { name: "Ground", parent: "Surfaces" },
  { name: "Lawn", parent: "Surfaces" },
  { name: "Marble", parent: "Surfaces" },
  { name: "Metal", parent: "Surfaces" },
  { name: "Rock", parent: "Surfaces" },
  { name: "Roofing", parent: "Surfaces" },
  { name: "Sand", parent: "Surfaces" },
  { name: "Snow", parent: "Surfaces" },
  { name: "Soil", parent: "Surfaces" },
  { name: "Stone", parent: "Surfaces" },
  { name: "Tile", parent: "Surfaces" },
  { name: "Wood", parent: "Surfaces" },
  { name: "Other", parent: "Surfaces" },
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
  },
  {
    name: "Fish 001 FBX",
    asset: "Fish 001",
    format: RepresentationFormat.FBX,
    type: RepresentationType.MODEL,
    uploader: 'admin',
    texture: "Fish 001 FBX texture"
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
  },
  {
    name: "Fish 002 FBX",
    asset: "Fish 002",
    format: RepresentationFormat.FBX,
    type: RepresentationType.MODEL,
    uploader: 'admin',
    texture: "Fish 002 FBX texture"
  },
  {
    name: "Fish 002 Preview",
    asset: "Fish 002",
    format: RepresentationFormat.IMG,
    type: RepresentationType.PREVIEW,
    uploader: 'admin',
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