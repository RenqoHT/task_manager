import { prisma } from "@/lib/prisma";
// import { hashSync } from "bcrypt";

async function up() {
    await prisma.user.createMany({
        data: [
            {
                user_login: "Artem69",
                user_password: '676767',
                user_role: "smm"
            },
            {
                user_login: "DimaDev",
                user_password: 'pussy69',
                user_role: "admin"
            }
        ]
    })
}

async function down() {
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
}

async function main() {
    try {
        await down();
        await up();
    } catch (e) {
        console.error(e);
    }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });