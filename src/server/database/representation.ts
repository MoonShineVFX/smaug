import { Prisma } from "@prisma/client";
import prisma from "../../client";

export async function create(
  payload: Prisma.RepresentationUncheckedCreateInput
) {
  console.log("into representation create post");
  const { name, type, format, path, fileSize, assetId, uploaderId } = payload;
  const representation: Prisma.RepresentationCreateInput = {
    name: name,
    type: type,
    format: format,
    path: path,
    fileSize: fileSize,
    asset: {
      connect: {
        id: assetId,
      },
    },
    uploader: {
      connect: {
        id: uploaderId,
      },
    },
  };
  const result = await prisma.representation.create({ data: representation });
  return result;
}
