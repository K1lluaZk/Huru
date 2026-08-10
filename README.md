# ShopHub — Proyecto Final de Programación III

Tienda online (e-commerce) full-stack que permite gestionar productos, usuarios, carrito de compras y pedidos, con un panel administrativo. Este repositorio corresponde al **Release 1**.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + TypeScript + Tailwind CSS (Vite) |
| Backend | Node.js + Express (API REST) |
| Base de datos | PostgreSQL + Prisma ORM |
| Autenticación | JWT + bcrypt |
| Pruebas E2E | Selenium WebDriver + Mocha |
| Gestión de proyecto | Jira (ver `docs/historias-de-usuario.md`) |
| Repositorio | GitHub |

## Estructura del proyecto

```
shophub/
├── backend/                 # API REST (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma    # Modelos de datos
│   │   └── seed.js          # Datos de prueba (admin, cliente, categorías, productos)
│   └── src/
│       ├── config/          # Cliente Prisma
│       ├── controllers/     # Lógica de negocio por módulo
│       ├── middleware/      # Auth, validación, manejo de errores
│       ├── routes/          # Definición de endpoints REST
│       ├── validators/      # Reglas de validación (express-validator)
│       ├── utils/           # JWT, ApiError, asyncHandler
│       ├── app.js
│       └── server.js
├── frontend/                 # SPA (React + TypeScript + Tailwind)
│   └── src/
│       ├── components/       # Navbar, ProductCard, rutas protegidas, etc.
│       ├── context/          # AuthContext, CartContext
│       ├── pages/            # Vistas de cliente
│       │   └── admin/        # Vistas de administrador
│       ├── services/         # Cliente Axios por módulo (auth, products, cart, orders...)
│       └── types/            # Tipos TypeScript compartidos
├── selenium-tests/           # Pruebas E2E automatizadas
│   ├── tests/                # Casos de prueba por módulo
│   ├── utils/                # Fábrica de WebDriver y helpers
│   └── config.js
└── docs/
    ├── historias-de-usuario.md
    └── casos-de-prueba.md
```

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+ (local o en contenedor)
- Google Chrome (para las pruebas Selenium)
- npm

## 1. Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tu cadena de conexión a PostgreSQL y un JWT_SECRET propio

npm install
npx prisma migrate dev --name init   # crea las tablas en PostgreSQL
npm run seed                          # carga usuarios y productos de prueba
npm run dev                           # http://localhost:4000
```

Verifica que la API responde: `GET http://localhost:4000/api/health`.

### Variables de entorno (`backend/.env`)

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/shophub?schema=public"
PORT=4000
NODE_ENV=development
JWT_SECRET="cambia_esta_clave_secreta"
JWT_EXPIRES_IN="1d"
CLIENT_URL="http://localhost:5173"
```

### Usuarios de prueba (creados por el seed)

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | admin@shophub.com | Admin123! |
| Cliente | cliente@shophub.com | Client123! |

## 2. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:4000/api

npm install
npm run dev     # http://localhost:5173
```

## 3. Integración

Con el backend corriendo en `:4000` y el frontend en `:5173` (configuración por defecto), la aplicación queda completamente integrada: el frontend consume la API REST mediante Axios (`frontend/src/services/api.ts`), adjuntando el token JWT en cada solicitud autenticada.

## 4. Pruebas automatizadas (Selenium)

Requiere que **backend y frontend estén corriendo** (`localhost:4000` y `localhost:5173`) y que la base de datos tenga los usuarios del seed.

```bash
cd selenium-tests
npm install
npm test
```

Por defecto los tests corren en modo *headless*. Para ver el navegador durante la ejecución, quita el argumento `--headless=new` en `selenium-tests/utils/driverFactory.js`.

Los archivos de prueba están organizados por módulo:
- `tests/auth.test.js` — registro, login, logout
- `tests/catalog.test.js` — catálogo, búsqueda, filtrado, detalle
- `tests/cart.test.js` — agregar, modificar y eliminar productos del carrito
- `tests/checkout.test.js` — creación de pedido e historial
- `tests/admin.test.js` — CRUD de productos, gestión de pedidos, dashboard

La trazabilidad completa entre historias de usuario, casos de prueba manuales y pruebas automatizadas está documentada en `docs/casos-de-prueba.md`.

## 5. Documentación funcional

- **Historias de usuario:** `docs/historias-de-usuario.md` (15 historias, formato compatible con Jira)
- **Casos de prueba funcionales:** `docs/casos-de-prueba.md` (31 casos de prueba manuales + trazabilidad con Selenium)

## Decisiones de arquitectura relevantes

- **Baja lógica de productos:** al eliminar un producto desde el panel admin, se marca `isActive: false` en lugar de borrarlo físicamente, para preservar la integridad de los pedidos históricos que lo referencian.
- **Carrito persistido en base de datos:** cada `CartItem` está asociado al `userId`, por lo que el carrito sobrevive a cierres de sesión y cambios de dispositivo.
- **Transacción de checkout:** la creación de un pedido (`Order` + `OrderItem[]`), la validación/descuento de stock y el vaciado del carrito ocurren dentro de una única transacción de Prisma (`prisma.$transaction`) para garantizar consistencia.
- **Manejo de errores centralizado:** todos los controladores usan `asyncHandler` + una clase `ApiError`, resueltos por un middleware único que también traduce errores conocidos de Prisma (p. ej. restricciones únicas) a respuestas HTTP claras.
- **Autorización por rol:** middleware `authenticate` + `authorize('ADMIN' | 'CLIENT')` protege cada grupo de rutas tanto en el backend (fuente de verdad) como en el frontend (rutas protegidas por UX).

## Alcance del Release 1 (y fuera de alcance)

Incluye: registro/login, roles cliente/administrador, catálogo con búsqueda y filtro, detalle de producto, carrito, checkout, historial de pedidos, CRUD de productos, gestión de pedidos y dashboard administrativo básico.

**Fuera de alcance (intencionalmente):** pagos reales, chat de soporte, cupones de descuento y motores de recomendación. Estos quedan reservados para releases futuros.
