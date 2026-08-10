const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/admin/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalProducts, totalUsers, totalOrders, revenueAgg, lowStockProducts, ordersByStatus] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
      prisma.order.groupBy({ by: ['status'], _count: { status: true } }),
    ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
  });

  res.json({
    success: true,
    data: {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: revenueAgg._sum.total || 0,
      lowStockProducts,
      ordersByStatus: ordersByStatus.map((o) => ({ status: o.status, count: o._count.status })),
      recentOrders,
    },
  });
});

module.exports = { getDashboardStats };
