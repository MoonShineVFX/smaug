import { faker } from "@faker-js/faker";
import { PrismaClient, UserType } from "@prisma/client";
import { findUserByAccount, hashPassword, comparePassword, limitedTokenNumber } from "../../../libs/server/auth";


let prisma: PrismaClient;

beforeEach(async () => {
  prisma = new PrismaClient();
});

afterEach(async () => {
  await prisma.$disconnect();
});

describe("auth realted api", () => {

  let password: string
  let hashedPassword: string

  it("hashPassword", async () => {
    password = 'admin'
    hashedPassword = await hashPassword('admin');
    expect(typeof (hashedPassword)).toBe("string");
  })

  it("comparePassword", async () => {
    const result = await comparePassword(password, hashedPassword);
    expect(result).toBe(true);
  })

  it("limit user's token number", async () => {

    // making fake data
    const adminUser = await prisma.user.findFirst({
      where: {
        account: "admin"
      }
    })

    // create 11 tokens
    await prisma.authToken.createMany({
      data: Array.from({ length: 11 }).map(() => {
        return {
          userId: adminUser!.id,
          createAt: faker.date.past(),
        }
      })
    })

    // limit token numbe
    const iuser = await findUserByAccount(adminUser!.account)
    await limitedTokenNumber(iuser!)
    const tokens = await prisma.authToken.findMany({ where: { userId: iuser!.id } });
    expect(tokens.length).toBe(10);
  })
})