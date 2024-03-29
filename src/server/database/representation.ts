import { Prisma } from "@prisma/client";
import prisma from "../../client";


export async function create(
  payload: Prisma.RepresentationUncheckedCreateInput
) {
  console.log("into representation create post");
  const { name, type, format, path, usage, fileSize, assetId, uploaderId } = payload;
  const representation: Prisma.RepresentationCreateInput = {
    name: name,
    type: type,
    format: format,
    path: path,
    usage: usage,
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


export async function deleteRepresentation(id: string) {
  const representation = await prisma.representation.findUnique({
    where: { id: id },
  });
  if (!representation) {
    throw new Error("not found");
  }
  const deleteName = representation.name;
  const deletedId = representation.id;
  await prisma.representation.delete({ where: { id: id } });
  return { deletedId, deleteName };
}


export async function detail(id: string) {
  const representation = await prisma.representation.findUnique({
    where: { id: id },
  });
  if (!representation) {
    throw new Error("not found");
  }
  return representation;
}


export async function deleteByAssetId(assetId: string) {
  const representations = await prisma.representation.findMany({
    where: { assetId: assetId },
  });
  if (!representations) {
    throw new Error("not found");
  }
  // update representations where deleted asset id, set isDeleted=true, return affect row count
  const re = await prisma.representation.updateMany({
    where: { assetId: assetId },
    data: { isDeleted: true },
  });
  return re.count;
}


export async function get(assetId: string) {
  const representations = await prisma.representation.findMany({
    where: { assetId: assetId },
  });
  if (!representations) {
    throw new Error("not found");
  }
  return representations;
}