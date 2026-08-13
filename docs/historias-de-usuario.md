# Historias de Usuario — Huru Release 1

Cada historia incluye criterios de aceptación en formato Given/When/Then y una estimación en puntos de historia (escala Fibonacci) para facilitar la planificación del sprint en Jira.

---

## HU-01 — Registro de usuario
**Como** visitante, **quiero** registrarme con mi nombre, email y contraseña, **para** poder comprar en Huru como cliente.

**Criterios de aceptación:**
- Dado que completo el formulario con datos válidos, cuando envío el formulario, entonces se crea mi cuenta con rol `CLIENT` y quedo autenticado automáticamente.
- Dado que el email ya está registrado, cuando intento registrarme, entonces el sistema muestra un error y no crea una cuenta duplicada.
- Dado que la contraseña tiene menos de 6 caracteres, cuando envío el formulario, entonces el sistema muestra un error de validación.

**Estimación:** 3 pts | **Prioridad:** Alta

---

## HU-02 — Inicio de sesión
**Como** usuario registrado, **quiero** iniciar sesión con mi email y contraseña, **para** acceder a mi cuenta y funciones según mi rol.

**Criterios de aceptación:**
- Dado credenciales válidas, cuando inicio sesión, entonces recibo un token JWT y soy redirigido según mi rol.
- Dado credenciales inválidas, cuando intento iniciar sesión, entonces el sistema muestra "Credenciales inválidas" sin revelar cuál campo es incorrecto.
- Dado que mi sesión expiró, cuando realizo una acción protegida, entonces se me redirige al login.

**Estimación:** 2 pts | **Prioridad:** Alta

---

## HU-03 — Cierre de sesión
**Como** usuario autenticado, **quiero** cerrar sesión, **para** proteger mi cuenta en dispositivos compartidos.

**Criterios de aceptación:**
- Dado que estoy autenticado, cuando hago clic en "Salir", entonces mi token se elimina localmente y se me redirige a una vista pública.
- Dado que cerré sesión, cuando intento acceder a una ruta protegida, entonces se me redirige al login.

**Estimación:** 1 pt | **Prioridad:** Media

---

## HU-04 — Catálogo de productos
**Como** visitante o cliente, **quiero** ver el catálogo de productos disponibles, **para** explorar qué puedo comprar.

**Criterios de aceptación:**
- Dado que accedo a la página principal, cuando la página carga, entonces veo una cuadrícula de productos activos con imagen, nombre y precio.
- Dado que hay más de 8 productos, cuando navego el catálogo, entonces los resultados están paginados.
- Dado que un producto no tiene stock, cuando lo veo en el catálogo, entonces se indica claramente "Sin stock".

**Estimación:** 3 pts | **Prioridad:** Alta

---

## HU-05 — Búsqueda y filtrado por categoría
**Como** cliente, **quiero** buscar productos por nombre y filtrarlos por categoría, **para** encontrar rápidamente lo que necesito.

**Criterios de aceptación:**
- Dado que escribo un término de búsqueda, cuando presiono Enter, entonces el catálogo muestra solo productos cuyo nombre o descripción coincide.
- Dado que selecciono una categoría del filtro, cuando se aplica, entonces solo se muestran productos de esa categoría.
- Dado que combino búsqueda y categoría, cuando ambos filtros están activos, entonces los resultados cumplen ambas condiciones.

**Estimación:** 3 pts | **Prioridad:** Alta

---

## HU-06 — Detalle de producto
**Como** cliente, **quiero** ver el detalle completo de un producto, **para** decidir si lo compro.

**Criterios de aceptación:**
- Dado que hago clic en un producto del catálogo, cuando la página carga, entonces veo imagen, nombre, descripción, precio y stock disponible.
- Dado que el producto no existe o fue dado de baja, cuando accedo a su URL, entonces el sistema muestra un error 404 controlado.

**Estimación:** 2 pts | **Prioridad:** Alta

---

## HU-07 — Agregar producto al carrito
**Como** cliente, **quiero** agregar productos a mi carrito de compras, **para** comprarlos más adelante en un solo pedido.

**Criterios de aceptación:**
- Dado que un producto tiene stock disponible, cuando hago clic en "Agregar al carrito", entonces el producto se añade (o incrementa su cantidad) en mi carrito persistido en base de datos.
- Dado que intento agregar más unidades de las disponibles en stock, cuando lo intento, entonces el sistema rechaza la acción con un mensaje claro.
- Dado que no he iniciado sesión, cuando intento agregar un producto, entonces se me redirige al login.

**Estimación:** 3 pts | **Prioridad:** Alta

---

## HU-08 — Gestionar el carrito de compras
**Como** cliente, **quiero** modificar cantidades o eliminar productos de mi carrito, **para** ajustar mi compra antes de pagar.

**Criterios de aceptación:**
- Dado que tengo productos en el carrito, cuando aumento o disminuyo la cantidad, entonces el subtotal y el total se recalculan automáticamente.
- Dado que elimino un producto del carrito, cuando confirmo la acción, entonces el producto desaparece de la lista y del total.
- Dado que mi carrito queda vacío, cuando lo visito, entonces veo un mensaje invitándome a seguir comprando.

**Estimación:** 3 pts | **Prioridad:** Alta

---

## HU-09 — Crear un pedido (checkout)
**Como** cliente, **quiero** confirmar mi pedido indicando una dirección de envío, **para** completar mi compra.

**Criterios de aceptación:**
- Dado que mi carrito tiene productos y stock disponible, cuando confirmo el pedido con una dirección válida, entonces se crea el pedido, se descuenta el stock y mi carrito se vacía.
- Dado que algún producto de mi carrito quedó sin stock antes de pagar, cuando intento confirmar, entonces el sistema informa cuál producto no puede procesarse y no crea el pedido.
- Dado que la dirección de envío está vacía o es muy corta, cuando intento confirmar, entonces el sistema muestra un error de validación.

**Estimación:** 5 pts | **Prioridad:** Alta

---

## HU-10 — Historial de pedidos del cliente
**Como** cliente, **quiero** ver el historial y detalle de mis pedidos anteriores, **para** hacer seguimiento a mis compras.

**Criterios de aceptación:**
- Dado que tengo pedidos previos, cuando accedo a "Mis pedidos", entonces veo la lista ordenada por fecha con estado y total.
- Dado que selecciono un pedido, cuando accedo a su detalle, entonces veo los productos, cantidades, precios y dirección de envío.
- Dado que intento ver el pedido de otro usuario por URL, cuando lo intento, entonces el sistema responde con error 404 (no autorizado a ver pedidos ajenos).

**Estimación:** 3 pts | **Prioridad:** Alta

---

## HU-11 — CRUD de productos (administrador)
**Como** administrador, **quiero** crear, editar, listar y eliminar productos, **para** mantener actualizado el catálogo de la tienda.

**Criterios de aceptación:**
- Dado que soy administrador, cuando creo un producto con datos válidos (nombre, descripción, precio, stock, categoría), entonces el producto aparece en el catálogo público.
- Dado que edito un producto existente, cuando guardo los cambios, entonces el catálogo refleja la información actualizada.
- Dado que elimino un producto, cuando confirmo la acción, entonces el producto deja de mostrarse en el catálogo público pero se conserva en pedidos históricos (baja lógica).
- Dado que un usuario con rol `CLIENT` intenta acceder a estas acciones, cuando lo intenta, entonces el sistema responde con error 403.

**Estimación:** 5 pts | **Prioridad:** Alta

---

## HU-12 — Gestión de categorías (administrador)
**Como** administrador, **quiero** crear y eliminar categorías de producto, **para** mantener organizado el catálogo.

**Criterios de aceptación:**
- Dado que creo una categoría con un nombre único, cuando la guardo, entonces queda disponible para asignar a productos.
- Dado que intento eliminar una categoría con productos asociados, cuando lo intento, entonces el sistema lo impide con un mensaje claro.

**Estimación:** 2 pts | **Prioridad:** Media

---

## HU-13 — Gestión de pedidos (administrador)
**Como** administrador, **quiero** ver todos los pedidos de la tienda y actualizar su estado, **para** gestionar el ciclo de vida de cada compra.

**Criterios de aceptación:**
- Dado que soy administrador, cuando accedo a "Gestión de pedidos", entonces veo todos los pedidos con cliente, fecha, total y estado.
- Dado que cambio el estado de un pedido (Pendiente → En proceso → Completado, o Cancelado), cuando guardo el cambio, entonces el nuevo estado se refleja para el administrador y el cliente.
- Dado que filtro pedidos por estado, cuando aplico el filtro, entonces solo veo pedidos que cumplen ese estado.

**Estimación:** 5 pts | **Prioridad:** Alta

---

## HU-14 — Dashboard administrativo
**Como** administrador, **quiero** ver un panel con métricas clave de la tienda, **para** tener una visión general del negocio.

**Criterios de aceptación:**
- Dado que accedo al dashboard, cuando la página carga, entonces veo: total de productos activos, total de clientes, total de pedidos, ingresos totales y productos con bajo stock.
- Dado que existen pedidos recientes, cuando veo el dashboard, entonces se listan los últimos 5 pedidos.
- Dado que existen pedidos en distintos estados, cuando veo el dashboard, entonces se muestra un resumen de pedidos agrupados por estado.

**Estimación:** 5 pts | **Prioridad:** Media

---

## HU-15 — Control de acceso por roles
**Como** propietario del sistema, **quiero** que las funciones administrativas estén restringidas al rol `ADMIN`, **para** proteger la integridad de los datos de la tienda.

**Criterios de aceptación:**
- Dado que un usuario con rol `CLIENT` intenta acceder a rutas `/admin/*`, cuando lo intenta desde el frontend, entonces es redirigido al catálogo.
- Dado que un usuario sin token intenta llamar a un endpoint protegido de la API, cuando lo intenta, entonces recibe un error 401.
- Dado que un usuario con rol `CLIENT` intenta llamar directamente a un endpoint de administrador vía API, cuando lo intenta, entonces recibe un error 403.

**Estimación:** 3 pts | **Prioridad:** Alta

---

### Resumen para el backlog de Jira

| ID | Historia | Épica | Puntos |
|----|----------|-------|--------|
| HU-01 | Registro de usuario | Autenticación | 3 |
| HU-02 | Inicio de sesión | Autenticación | 2 |
| HU-03 | Cierre de sesión | Autenticación | 1 |
| HU-04 | Catálogo de productos | Catálogo | 3 |
| HU-05 | Búsqueda y filtrado | Catálogo | 3 |
| HU-06 | Detalle de producto | Catálogo | 2 |
| HU-07 | Agregar al carrito | Carrito | 3 |
| HU-08 | Gestionar el carrito | Carrito | 3 |
| HU-09 | Crear pedido (checkout) | Pedidos | 5 |
| HU-10 | Historial de pedidos | Pedidos | 3 |
| HU-11 | CRUD de productos (admin) | Administración | 5 |
| HU-12 | Gestión de categorías (admin) | Administración | 2 |
| HU-13 | Gestión de pedidos (admin) | Administración | 5 |
| HU-14 | Dashboard administrativo | Administración | 5 |
| HU-15 | Control de acceso por roles | Seguridad | 3 |

**Total:** 15 historias de usuario, 48 puntos de historia estimados para el Release 1.
