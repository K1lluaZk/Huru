const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const buildCartResponse = (cartItems) => {
  const items = cartItems.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    product: item.product,
    subtotal: Number(item.product.price) * item.quantity,
  }));
  const total = items.reduce((acc, i) => acc + i.subtotal, 0);
  return { items, total, itemCount: items.reduce((acc, i) => acc + i.quantity, 0) };
};

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ success: true, data: buildCartResponse(cartItems) });
});

// POST /api/cart  { productId, quantity }
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await prisma.product.findUnique({ where: { id: parseInt(productId, 10) } });

  if (!product || !product.isActive) throw ApiError.notFound('Producto no encontrado');
  if (product.stock < quantity) throw ApiError.badRequest('Stock insuficiente');

  const existing = await prisma.cartItem.findUnique({
    where: { userId_productId: { userId: req.user.id, productId: product.id } },
  });

  let cartItem;
  if (existing) {
    const newQuantity = existing.quantity + quantity;
    if (product.stock < newQuantity) throw ApiError.badRequest('Stock insuficiente');
    cartItem = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQuantity },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: { userId: req.user.id, productId: product.id, quantity },
    });
  }

  res.status(201).json({ success: true, message: 'Producto agregado al carrito', data: cartItem });
});

// PUT /api/cart/:itemId  { quantity }
const updateCartItem = asyncHandler(async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const { quantity } = req.body;

  const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { product: true } });
  if (!cartItem || cartItem.userId !== req.user.id) throw ApiError.notFound('Ítem de carrito no encontrado');

  if (cartItem.product.stock < quantity) throw ApiError.badRequest('Stock insuficiente');

  const updated = await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  res.json({ success: true, message: 'Cantidad actualizada', data: updated });
});

// DELETE /api/cart/:itemId
const removeCartItem = asyncHandler(async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!cartItem || cartItem.userId !== req.user.id) throw ApiError.notFound('Ítem de carrito no encontrado');

  await prisma.cartItem.delete({ where: { id: itemId } });
  res.json({ success: true, message: 'Producto eliminado del carrito' });
});

// DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
  res.json({ success: true, message: 'Carrito vaciado' });
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
