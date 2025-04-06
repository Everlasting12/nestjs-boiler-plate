import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const user = {
  userId: '1b3f45db-7047-486c-be03-bdca3fe5ba31',
  email: 'sidheshparab@gmail.com',
  name: 'Sidhesh Parab',
  password: '$2b$10$x5cBZ8WJ5W62EWWSVbj/EO62vvL9fxzBs9KKtUgHEx1aD2oDtFTre', // Sidhesh@123
  createdAt: '2024-11-10T06:58:06.253Z',
  updatedAt: '2024-11-10T06:58:06.253Z',
  isActive: true,
  firebaseTokens: [],
  profilePic: null,
  lastLogin: null,
};
async function main() {
  await prisma.user.createMany({
    data: [user],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
