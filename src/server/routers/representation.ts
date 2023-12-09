import { z } from 'zod';
import { RepresentationType, RepresentationFormat } from '@prisma/client';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { create, deleteRepresentation, detail, deleteByAssetId, get } from '../database/representation'
import { TRPCError } from '@trpc/server';


export const representationRouter = router({

  list: publicProcedure
    .input(z.object({ assetId: z.string() }))
    .query(async (opts) => {
      const { assetId } = opts.input
      return { list: await get(assetId) }
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      path: z.string(),
      format: z.nativeEnum(RepresentationFormat),
      type: z.nativeEnum(RepresentationType),
      assetId: z.string(),
      uploaderId: z.string(),
      textureId: z.string().optional().nullable(),
      fileSize: z.number().optional().nullable(),
    }))
    .mutation(async (opts) => {
      const { name, path, format, type, assetId, uploaderId, textureId, fileSize } = opts.input
      const representation = await create({
        name: name,
        path: path,
        format: format,
        type: type,
        assetId: assetId,
        uploaderId: uploaderId,
        textureId: textureId,
        fileSize: fileSize,
      })
      return { detail: representation }
    }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async (opts) => {
      const { id } = opts.input
      return { detail: await detail(id) }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      const { id } = opts.input
      try {
        const { deletedId, deleteName } = await deleteRepresentation(id)
        return { deleteId: deletedId, deleteName: deleteName }
      }
      catch (err) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: (err as Error).message,
        })
      }
    }),

  deleteByAssetId: protectedProcedure
    .input(z.object({ assetId: z.string() }))
    .mutation(async (opts) => {
      const { assetId } = opts.input
      try {
        return { count: await deleteByAssetId(assetId) }
      }
      catch (err) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: (err as Error).message,
        })
      }
    }),

})