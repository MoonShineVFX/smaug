import { z } from 'zod';


const UuidSchema = z.object({
    id: z.string(),
});


export const UserTypeSchema = z.union([
    z.literal("HUMAN"),
    z.literal("BOT"),
]);

  
export const  RepresentationTypeSchema = z.union([
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
    assetId: UuidSchema,
    path: z.string().optional(),
    type: RepresentationTypeSchema.optional(),
    format: RepresentationFormatSchema.optional(),
    fileSize: z.number().optional(),
    createAt: z.date(),
    updateAt: z.date().optional(),
    userId: UuidSchema.optional(),
    textureId: UuidSchema.optional(),

});


export const assertCreateSchema = z.object({
    name: z.string().min(1).max(255),
    categoryId: z.number().optional(),
    tags: z.array(UuidSchema).optional(),});

