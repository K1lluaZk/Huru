/**
 * Seed script: creates an admin user, a client user, categories and products.
 * Run with: npm run seed
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const clientPassword = await bcrypt.hash('Client123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@huru.com' },
    update: {},
    create: {
      name: 'Administrador Huru',
      email: 'admin@huru.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'cliente@huru.com' },
    update: {},
    create: {
      name: 'Cliente Demo',
      email: 'cliente@huru.com',
      password: clientPassword,
      role: 'CLIENT',
    },
  });

  const categoriesData = [
    { name: 'Electrónica', slug: 'electronica' },
    { name: 'Ropa', slug: 'ropa' },
    { name: 'Hogar', slug: 'hogar' },
    { name: 'Deportes', slug: 'deportes' },
  ];

  const categories = {};
  for (const c of categoriesData) {
    categories[c.slug] = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const products = [
    {
      name: 'Auriculares Bluetooth',
      description: 'Auriculares inalámbricos con cancelación de ruido.',
      price: 49.99,
      stock: 25,
      imageUrl: 'https://picsum.photos/seed/auriculares/400/400',
      categorySlug: 'electronica',
    },
    {
      name: 'Smartwatch Serie 5',
      description: 'Reloj inteligente con monitor de ritmo cardíaco.',
      price: 89.99,
      stock: 15,
      imageUrl: 'https://picsum.photos/seed/smartwatch/400/400',
      categorySlug: 'electronica',
    },
    {
      name: 'Camiseta Deportiva',
      description: 'Camiseta transpirable de secado rápido.',
      price: 19.99,
      stock: 50,
      imageUrl: 'https://picsum.photos/seed/camiseta/400/400',
      categorySlug: 'ropa',
    },
    {
      name: 'Jean Slim Fit',
      description: 'Jean de mezclilla corte moderno.',
      price: 34.99,
      stock: 30,
      imageUrl: 'https://picsum.photos/seed/jean/400/400',
      categorySlug: 'ropa',
    },
    {
      name: 'Set de Ollas Antiadherentes',
      description: 'Juego de 5 piezas para cocina.',
      price: 65.0,
      stock: 10,
      imageUrl: 'https://picsum.photos/seed/ollas/400/400',
      categorySlug: 'hogar',
    },
    {
      name: 'Lámpara de Escritorio LED',
      description: 'Lámpara regulable con puerto USB.',
      price: 22.5,
      stock: 40,
      imageUrl: 'https://picsum.photos/seed/lampara/400/400',
      categorySlug: 'hogar',
    },
    {
      name: 'Balón de Fútbol',
      description: 'Balón oficial talla 5.',
      price: 24.99,
      stock: 35,
      imageUrl: 'https://picsum.photos/seed/balon/400/400',
      categorySlug: 'deportes',
    },
    {
      name: 'Mancuernas Ajustables',
      description: 'Par de mancuernas 2-10 kg ajustables.',
      price: 79.99,
      stock: 12,
      imageUrl: 'https://picsum.photos/seed/mancuernas/400/400',
      categorySlug: 'deportes',
    },
  ];

  for (const p of products) {
    const { categorySlug, ...data } = p;
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({
        data: { ...data, categoryId: categories[categorySlug].id },
      });
    }
  }

  console.log('Seed completado.');
  console.log(`Admin: admin@huru.com / Admin123!`);
  console.log(`Cliente: cliente@huru.com / Client123!`);
  console.log(`Usuarios creados: ${admin.email}, ${client.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
