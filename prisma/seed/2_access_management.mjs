import { PrismaClient } from '@prisma/client';
import { user } from './1_admin_user.mjs';

const prisma = new PrismaClient();
async function main() {
  await prisma.permission.createMany({
    data: [
      {
        name: 'ALL_ACCESS',
        apiScopes: ['ALL::.*/api/v1/.*'],
        feScopes: [
          '*:*:*', // module:CRUD:field or *:*:*
        ],
        permissionEntities: {},
      },
      {
        name: 'CREATE_USERS',
        apiScopes: ['POST::.*/api/v1/users.*'],
        feScopes: ['USERS:READ:*', 'USERS:CREATE:*'],
        permissionEntities: {},
      },
      {
        name: 'READ_USERS',
        apiScopes: ['GET::.*/api/v1/users.*'],
        feScopes: ['USERS:READ:*'],
        permissionEntities: {},
      },
      {
        name: 'UPDATE_USERS',
        apiScopes: ['PATCH::.*/api/v1/users.*', 'PUT::.*/api/v1/users.*'],
        feScopes: ['USERS:READ:*', 'USERS:UPDATE:*'],
        permissionEntities: {},
      },
      {
        name: 'DELETE_USERS',
        apiScopes: ['DELETE::.*/api/v1/users.*'],
        feScopes: ['USERS:READ:*', 'USERS:DELETE:*'],
        permissionEntities: {},
      },
    ],
    skipDuplicates: true, // Optional: avoids throwing errors if records exist
  });

  await prisma.role.createMany({
    data: [
      {
        name: 'Admin',
        roleId: 'ADMIN',
        permissionIds: ['ALL_ACCESS'],
        permissionEntities: {},
      },
    ],
    skipDuplicates: true,
  });
  await prisma.userRole.createMany({
    data: [
      {
        userId: user.userId,
        roleId: 'ADMIN',
        permissionEntities: {},
      },
    ],
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
