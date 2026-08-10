const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// POST /api/orders  { shippingAddress }
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  const order = await prisma.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw ApiError.badRequest('El carrito está vacío');
    }

    for (const item of cartItems) {
      if (!item.product.isActive) {
        throw ApiError.badRequest(`El producto "${item.product.name}" ya no está disponible`);
      }
      if (item.product.stock < item.quantity) {
        throw ApiError.badRequest(`Stock insuficiente para "${item.product.name}"`);
      }
    }

    const total = cartItems.reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0
    );

    const newOrder = await tx.order.create({
      data: {
        userId: req.user.id,
        total,
        shippingAddress,
        status: 'PENDING',
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: req.user.id } });

    return newOrder;
  });

  res.status(201).json({ success: true, message: 'Pedido creado exitosamente', data: order });
});

// GET /api/orders  (own order history)
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orders });
});

// GET /api/orders/:id  (own order detail)
const getMyOrderById = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order || order.userId !== req.user.id) {
    throw ApiError.notFound('Pedido no encontrado');
  }

  res.json({ success: true, data: order });
});

// GET /api/admin/orders  (ADMIN - all orders)
const getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const orders = await prisma.order.findMany({
    where: status ? { status } : undefined,
    include: {
      items: { include: { product: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: orders });
});

// PUT /api/admin/orders/:id/status  (ADMIN)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw ApiError.notFound('Pedido no encontrado');

  const updated = await prisma.order.update({
    where: { id },
    data: { status },
    include: { items: { include: { product: true } }, user: { select: { id: true, name: true, email: true } } },
  });

  res.json({ success: true, message: 'Estado del pedido actualizado', data: updated });
});

module.exports = { createOrder, getMyOrders, getMyOrderById, getAllOrders, updateOrderStatus };
