# Casos de Prueba Funcionales — Huru Release 1

Cada caso de prueba está vinculado a su historia de usuario (HU) y, cuando aplica, al test automatizado de Selenium que lo cubre. Precondición general: la base de datos cuenta con los datos del seed (`admin@huru.com` / `Admin123!` y `cliente@huru.com` / `Client123!`).

---

## Módulo: Autenticación

### CP-01 — Registro exitoso
- **HU relacionada:** HU-01
- **Precondición:** El email a usar no existe en el sistema.
- **Pasos:**
  1. Ir a `/register`.
  2. Completar nombre, email, contraseña y confirmación con datos válidos.
  3. Enviar el formulario.
- **Resultado esperado:** Se crea la cuenta con rol `CLIENT`, el usuario queda autenticado y es redirigido al catálogo (`/`).
- **Automatizado en:** `tests/auth.test.js` → HU-01

### CP-02 — Registro con contraseñas no coincidentes
- **HU relacionada:** HU-01
- **Pasos:** Completar el formulario de registro con "Contraseña" y "Confirmar contraseña" distintos.
- **Resultado esperado:** Se muestra el mensaje "Las contraseñas no coinciden" y no se crea la cuenta.
- **Automatizado en:** `tests/auth.test.js` → HU-02

### CP-03 — Registro con email duplicado
- **HU relacionada:** HU-01
- **Precondición:** Usar el email `cliente@huru.com` (ya registrado).
- **Resultado esperado:** El backend responde 409 y el frontend muestra "Ya existe una cuenta registrada con ese email".
- **Automatizado:** Cubierto a nivel de API (ver sección de pruebas de backend).

### CP-04 — Login exitoso
- **HU relacionada:** HU-02
- **Pasos:** Ir a `/login`, ingresar `cliente@huru.com` / `Client123!`, enviar.
- **Resultado esperado:** Redirección a `/`, token JWT almacenado, navbar muestra el nombre del usuario y el enlace del carrito.
- **Automatizado en:** `tests/auth.test.js` → HU-03

### CP-05 — Login con credenciales inválidas
- **HU relacionada:** HU-02
- **Pasos:** Ingresar un email válido con contraseña incorrecta.
- **Resultado esperado:** Mensaje "Credenciales inválidas", el usuario permanece en `/login`.
- **Automatizado en:** `tests/auth.test.js` → HU-04

### CP-06 — Cierre de sesión
- **HU relacionada:** HU-03
- **Pasos:** Estando autenticado, hacer clic en "Salir".
- **Resultado esperado:** El token se elimina, la navbar vuelve a mostrar "Ingresar" / "Registrarse".
- **Automatizado en:** `tests/auth.test.js` → HU-05

### CP-07 — Acceso a ruta protegida sin sesión
- **HU relacionada:** HU-15
- **Pasos:** Sin iniciar sesión, navegar directamente a `/cart` o `/orders`.
- **Resultado esperado:** Redirección automática a `/login`.

---

## Módulo: Catálogo

### CP-08 — Ver catálogo público
- **HU relacionada:** HU-04
- **Pasos:** Ir a `/` sin iniciar sesión.
- **Resultado esperado:** Se muestra una cuadrícula de productos activos con imagen, nombre, categoría y precio.
- **Automatizado en:** `tests/catalog.test.js` → HU-06

### CP-09 — Búsqueda por nombre
- **HU relacionada:** HU-05
- **Pasos:** Escribir "Auriculares" en el buscador y presionar Enter.
- **Resultado esperado:** Solo se listan productos cuyo nombre o descripción contiene "Auriculares".
- **Automatizado en:** `tests/catalog.test.js` → HU-07

### CP-10 — Filtrado por categoría
- **HU relacionada:** HU-05
- **Pasos:** Seleccionar una categoría del combo "Todas las categorías".
- **Resultado esperado:** Solo se muestran productos de la categoría seleccionada; la URL refleja `categoryId`.
- **Automatizado en:** `tests/catalog.test.js` → HU-08

### CP-11 — Búsqueda sin resultados
- **HU relacionada:** HU-05
- **Pasos:** Buscar un término que no coincide con ningún producto (ej. "xyzxyz123").
- **Resultado esperado:** Se muestra el mensaje "No se encontraron productos."

### CP-12 — Ver detalle de producto
- **HU relacionada:** HU-06
- **Pasos:** Hacer clic en una tarjeta de producto desde el catálogo.
- **Resultado esperado:** Se muestra la página de detalle con imagen, descripción completa, precio y stock.
- **Automatizado en:** `tests/catalog.test.js` → HU-09

### CP-13 — Paginación del catálogo
- **HU relacionada:** HU-04
- **Precondición:** Existen más de 8 productos activos.
- **Pasos:** Ir a la página principal y hacer clic en "Siguiente".
- **Resultado esperado:** Se cargan los siguientes productos y el indicador de página se actualiza.

---

## Módulo: Carrito

### CP-14 — Agregar producto al carrito
- **HU relacionada:** HU-07
- **Precondición:** Sesión iniciada como cliente.
- **Pasos:** Ir al detalle de un producto con stock, hacer clic en "Agregar al carrito".
- **Resultado esperado:** Mensaje de éxito "Producto agregado al carrito"; el contador del carrito en la navbar se incrementa.
- **Automatizado en:** `tests/cart.test.js` → HU-10

### CP-15 — Intentar agregar cantidad mayor al stock disponible
- **HU relacionada:** HU-07
- **Pasos:** En el detalle de un producto, ingresar una cantidad mayor al stock disponible y agregar al carrito.
- **Resultado esperado:** El campo de cantidad limita el valor máximo al stock disponible (validación en frontend) y el backend rechaza cualquier intento adicional con error 400.

### CP-16 — Visualizar contenido del carrito
- **HU relacionada:** HU-08
- **Pasos:** Con productos agregados, ir a `/cart`.
- **Resultado esperado:** Se listan los productos con cantidad, subtotal y el total general calculado correctamente.
- **Automatizado en:** `tests/cart.test.js` → HU-11

### CP-17 — Modificar cantidad en el carrito
- **HU relacionada:** HU-08
- **Pasos:** En `/cart`, hacer clic en "+" para aumentar la cantidad de un ítem.
- **Resultado esperado:** La cantidad y el subtotal se actualizan sin recargar la página.
- **Automatizado en:** `tests/cart.test.js` → HU-12

### CP-18 — Eliminar producto del carrito
- **HU relacionada:** HU-08
- **Pasos:** Hacer clic en "Eliminar" sobre un ítem del carrito.
- **Resultado esperado:** El ítem desaparece de la lista y el total se recalcula. Si era el único ítem, se muestra el estado de carrito vacío.
- **Automatizado en:** `tests/cart.test.js` → HU-13

---

## Módulo: Pedidos (Checkout e Historial)

### CP-19 — Crear pedido exitosamente
- **HU relacionada:** HU-09
- **Precondición:** El carrito tiene al menos un producto con stock disponible.
- **Pasos:** Ir a `/cart` → "Continuar con la compra" → completar dirección de envío → "Confirmar pedido".
- **Resultado esperado:** Se crea el pedido con estado `PENDING`, el stock del producto se descuenta, el carrito queda vacío y se redirige al detalle del pedido con un mensaje de éxito.
- **Automatizado en:** `tests/checkout.test.js` → HU-14

### CP-20 — Intentar checkout con dirección vacía
- **HU relacionada:** HU-09
- **Pasos:** En `/checkout`, dejar el campo de dirección vacío e intentar enviar.
- **Resultado esperado:** El formulario no se envía (validación HTML5 `required` + validación de backend como respaldo).

### CP-21 — Checkout con carrito vacío
- **HU relacionada:** HU-09
- **Pasos:** Navegar directamente a `/checkout` sin productos en el carrito.
- **Resultado esperado:** Redirección automática a `/cart`.

### CP-22 — Ver historial de pedidos
- **HU relacionada:** HU-10
- **Pasos:** Como cliente autenticado, ir a `/orders`.
- **Resultado esperado:** Se listan los pedidos propios ordenados del más reciente al más antiguo, con estado y total.
- **Automatizado en:** `tests/checkout.test.js` → HU-15

### CP-23 — Ver detalle de un pedido propio
- **HU relacionada:** HU-10
- **Pasos:** Desde `/orders`, hacer clic en un pedido.
- **Resultado esperado:** Se muestra el detalle completo: productos, cantidades, precios, dirección y estado.
- **Automatizado en:** `tests/checkout.test.js` → HU-16

### CP-24 — Intentar ver el pedido de otro cliente
- **HU relacionada:** HU-10
- **Pasos:** Autenticado como Cliente A, acceder manualmente a `/orders/{id}` de un pedido perteneciente a Cliente B.
- **Resultado esperado:** El backend responde 404 (no se revela la existencia del pedido ajeno).

---

## Módulo: Administración

### CP-25 — Ver dashboard administrativo
- **HU relacionada:** HU-14
- **Precondición:** Sesión iniciada como `ADMIN`.
- **Pasos:** Ir a `/admin`.
- **Resultado esperado:** Se muestran las tarjetas de métricas (productos, clientes, pedidos, ingresos, bajo stock), pedidos por estado y pedidos recientes.
- **Automatizado en:** `tests/admin.test.js` → HU-17

### CP-26 — Crear producto (admin)
- **HU relacionada:** HU-11
- **Pasos:** En `/admin/products`, clic en "Nuevo producto", completar el formulario y guardar.
- **Resultado esperado:** El producto aparece en la tabla de administración y en el catálogo público.
- **Automatizado en:** `tests/admin.test.js` → HU-18

### CP-27 — Editar producto (admin)
- **HU relacionada:** HU-11
- **Pasos:** Editar un producto existente cambiando su precio y guardar.
- **Resultado esperado:** El nuevo precio se refleja inmediatamente en la tabla y en el catálogo.
- **Automatizado en:** `tests/admin.test.js` → HU-19

### CP-28 — Eliminar producto (admin)
- **HU relacionada:** HU-11
- **Pasos:** Eliminar (baja lógica) un producto de prueba.
- **Resultado esperado:** El producto deja de aparecer en el catálogo público, pero permanece en pedidos ya creados.
- **Automatizado en:** `tests/admin.test.js` → HU-21

### CP-29 — Cambiar estado de un pedido (admin)
- **HU relacionada:** HU-13
- **Pasos:** En `/admin/orders`, cambiar el estado de un pedido de `PENDING` a `PROCESSING`.
- **Resultado esperado:** El nuevo estado se guarda y se refleja tanto en la vista de administrador como en el historial del cliente.
- **Automatizado en:** `tests/admin.test.js` → HU-20

### CP-30 — Acceso denegado a rutas de administrador
- **HU relacionada:** HU-15
- **Pasos:** Autenticado como `CLIENT`, intentar navegar a `/admin`.
- **Resultado esperado:** Redirección automática al catálogo (`/`); si se llama directamente a la API (`/api/admin/*`), el backend responde 403.

### CP-31 — Intentar eliminar una categoría con productos asociados
- **HU relacionada:** HU-12
- **Pasos:** Como admin, intentar eliminar una categoría que tiene productos asignados.
- **Resultado esperado:** El backend responde 409 con un mensaje explicando que la categoría tiene productos asociados.

---

## Trazabilidad Historias de Usuario ↔ Casos de Prueba ↔ Pruebas Automatizadas

| HU | Casos de prueba | Archivo Selenium |
|----|------------------|-------------------|
| HU-01 | CP-01, CP-02, CP-03 | `auth.test.js` |
| HU-02 | CP-04, CP-05, CP-07 | `auth.test.js` |
| HU-03 | CP-06 | `auth.test.js` |
| HU-04 | CP-08, CP-13 | `catalog.test.js` |
| HU-05 | CP-09, CP-10, CP-11 | `catalog.test.js` |
| HU-06 | CP-12 | `catalog.test.js` |
| HU-07 | CP-14, CP-15 | `cart.test.js` |
| HU-08 | CP-16, CP-17, CP-18 | `cart.test.js` |
| HU-09 | CP-19, CP-20, CP-21 | `checkout.test.js` |
| HU-10 | CP-22, CP-23, CP-24 | `checkout.test.js` |
| HU-11 | CP-26, CP-27, CP-28 | `admin.test.js` |
| HU-12 | CP-31 | — (prueba manual/API) |
| HU-13 | CP-29 | `admin.test.js` |
| HU-14 | CP-25 | `admin.test.js` |
| HU-15 | CP-07, CP-30 | — (prueba manual/API) |
