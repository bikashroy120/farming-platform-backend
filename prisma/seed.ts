import { faker } from '@faker-js/faker';
import { Role } from '../generated/prisma/client';
import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/app/helpers/bcrypt';

async function main() {
  console.log('🌱 Seeding started...');

  const hashedPassword = await hashPassword('123456');
  // Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  // Customers (optional)
  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
    });
  }

  // Vendors + VendorProfile
  const vendors: any[] = [];

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: Role.VENDOR,
      },
    });

    const vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId: user.id,
        farmName: faker.company.name(),
        farmLocation: faker.location.city(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      },
    });

    vendors.push(vendorProfile);
  }

  // Products (100)
  for (let i = 0; i < 100; i++) {
    const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];

    await prisma.produce.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        category: faker.commerce.department(),
        availableQuantity: faker.number.int({ min: 1, max: 100 }),
        vendorId: randomVendor.id,
      },
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
