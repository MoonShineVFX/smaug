import { z } from 'zod';
import { prisma } from './prisma';


export const categoryIdSchema = z.number().refine(async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  return Boolean(category); // 如果 category 存在，則返回 true，否則返回 false
}, {
  message: "The provided categoryId does not exist in the database.", // 錯誤消息
});


export const UserTypeSchema = z.union([
  z.literal("HUMAN"),
  z.literal("BOT"),
]);


export const RepresentationTypeSchema = z.union([
  z.literal("PREVIEW"),
  z.literal("RENDER"),
  z.literal("MODEL"),
  z.literal("TEXTURE"),
]);


export const RepresentationFormatSchema = z.union([
  z.literal("IMG"),
  z.literal("FBX"),
  z.literal("GLB"),
  z.literal("MAX"),
  z.literal("MB"),
  z.literal("OBJ"),
  z.literal("C4D"),
  z.literal("UNREAL"),
]);


export const tagSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
});


export const representationSchema = z.object({
  id: z.number(),
  name: z.string(),
  assetId: z.string(),
  path: z.string().optional(),
  type: RepresentationTypeSchema.optional(),
  format: RepresentationFormatSchema.optional(),
  fileSize: z.number().optional(),
  createAt: z.date(),
  updateAt: z.date().optional(),
  userId: z.string().optional(),
  textureId: z.string().optional(),
});


export const representationUpdateSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  filenama: z.string().optional(),
  format: RepresentationFormatSchema.optional(),
  fileSize: z.number().optional(),
  textureId: z.string().optional(),
});


export const assetCreateSchema = z.object({
  name: z.string().min(1).max(255),
  categoryId: categoryIdSchema,
  tags: z.array(z.string()).optional(),
});


export const assetUpdateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(255).optional(),
  categoryId: categoryIdSchema,
  representation: z.array(representationUpdateSchema).optional(),
  tags: z.array(z.string()).optional(),
});
