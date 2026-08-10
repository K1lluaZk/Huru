const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Verifies the Bearer JWT token and attaches the authenticated user
 * (without the password hash) to req.user.
 */
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Token no proporcionado');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Token inválido o expirado');
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });
  if (!user) {
    throw ApiError.unauthorized('Usuario no encontrado');
  }

  req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  next();
});

/**
 * Restricts access to the given roles. Use after `authenticate`.
 * Example: authorize('ADMIN')
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    throw ApiError.unauthorized();
  }
  if (!roles.includes(req.user.role)) {
    throw ApiError.forbidden('No tienes permisos para realizar esta acción');
  }
  next();
};

module.exports = { authenticate, authorize };
