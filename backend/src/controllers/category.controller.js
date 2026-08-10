const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

// GET /api/categories
const listCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json({ success: true, data: categories });
});

// POST /api/categories (ADMIN)
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name);

  const existing = await prisma.category.findFirst({ where: { OR: [{ name }, { slug }] } });
  if (existing) throw ApiError.conflict('Ya existe una categoría con ese nombre');

  const category = await prisma.category.create({ data: { name, slug } });
  res.status(201).json({ success: true, message: 'Categoría creada', data: category });
});

// DELETE /api/categories/:id (ADMIN)
const deleteCategory = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw ApiError.notFound('Categoría no encontrada');

  const productsCount = await prisma.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    throw ApiError.conflict('No se puede eliminar: la categoría tiene productos asociados');
  }

  await prisma.category.delete({ where: { id } });
  res.json({ success: true, message: 'Categoría eliminada' });
});

module.exports = { listCategories, createCategory, deleteCategory };
