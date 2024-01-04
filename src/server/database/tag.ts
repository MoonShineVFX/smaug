import prisma from "../../client";


export function list() {
    return prisma.tag.findMany({})
}