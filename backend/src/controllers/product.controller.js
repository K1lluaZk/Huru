const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/products?search=&categoryId=&page=&limit=
// Public catalog listing with search, category filter and pagination.
const listProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const { search, categoryId } = req.query;

  const where = {
    isActive: true,
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(categoryId && { categoryId: parseInt(categoryId, 10) }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  res.json({
    success: true,
    data: products,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product || !product.isActive) {
    throw ApiError.notFound('Producto no encontrado');
  }

  res.json({ success: true, data: product });
});

// POST /api/products  (ADMIN)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, imageUrl, categoryId } = req.body;

  const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId, 10) } });
  if (!category) throw ApiError.badRequest('La categoría indicada no existe');

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      imageUrl: imageUrl || null,
      categoryId: parseInt(categoryId, 10),
    },
  });

  res.status(201).json({ success: true, message: 'Producto creado', data: product });
});

// PUT /api/products/:id  (ADMIN)
const updateProduct = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Producto no encontrado');

  const { name, description, price, stock, imageUrl, categoryId, isActive } = req.body;

  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: parseInt(categoryId, 10) } });
    if (!category) throw ApiError.badRequest('La categoría indicada no existe');
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(stock !== undefined && { stock }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(categoryId !== undefined && { categoryId: parseInt(categoryId, 10) }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  res.json({ success: true, message: 'Producto actualizado', data: product });
});

// DELETE /api/products/:id  (ADMIN) - soft delete
const deleteProduct = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw ApiError.notFound('Producto no encontrado');

  // Soft delete: keep historical order references intact.
  await prisma.product.update({ where: { id }, data: { isActive: false } });

  res.json({ success: true, message: 'Producto eliminado' });
});

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
