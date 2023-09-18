import prisma from '../../client';


export async function removeToken(token: string): Promise<boolean> {
    try {
        await prisma.authToken.delete({
            where: {
                id: token
            },
        })
        return true;
    } catch (e) {
        console.error(e)
        return false;
    }
}