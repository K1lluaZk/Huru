const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw ApiError.conflict('Ya existe una cuenta registrada con ese email');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'CLIENT' },
  });

  const token = generateToken({ id: user.id, role: user.role });

  res.status(201).json({
    success: true,
    message: 'Registro exitoso',
    data: { user: sanitizeUser(user), token },
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw ApiError.unauthorized('Credenciales inválidas');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw ApiError.unauthorized('Credenciales inválidas');
  }

  const token = generateToken({ id: user.id, role: user.role });

  res.json({
    success: true,
    message: 'Inicio de sesión exitoso',
    data: { user: sanitizeUser(user), token },
  });
});

// GET /api/auth/me
const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw ApiError.notFound('Usuario no encontrado');
  res.json({ success: true, data: sanitizeUser(user) });
});

module.exports = { register, login, me };
