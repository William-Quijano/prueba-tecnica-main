# Products CRUD - Prueba Técnica Frontend 🚀

¡Bienvenido/a! Esta es una prueba técnica para evaluar tus habilidades como desarrollador/a Frontend.

## Objetivo

Crear una aplicación web para **listar y administrar productos** consumiendo la API REST proporcionada.

## Stack del Backend

- **Runtime**: Bun
- **Framework**: Hono
- **ORM**: Drizzle ORM
- **Database**: Neon, Supabase o cualquier base de datos serverless PostgreSQL compatible

> **Nota**: Debes crear tu propia cuenta gratuita en [Neon](https://neon.tech), [Supabase](https://supabase.com) u otro servicio compatible. No es necesario compartir credenciales. Puedes modificar la configuración de base de datos según tu preferencia.

## Cómo correr el Backend

```bash
cd backend
bun install
bun run db:push    # Crear tablas en Neon
bun run db:seed    # Insertar 10 productos de prueba
bun run dev        # Iniciar servidor en http://localhost:3000
```

## Documentación de la API

Base URL: `http://localhost:3001`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Listar todos los productos |
| GET | `/api/products?search=laptop` | Buscar productos por nombre/descripción/categoría |
| GET | `/api/products/:id` | Obtener un producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PUT | `/api/products/:id` | Actualizar producto |
| DELETE | `/api/products/:id` | Eliminar producto |

### Ejemplos de Request/Response

**GET /api/products**
```json
[
  {
    "id": "1",
    "name": "Laptop Pro X1",
    "price": 1299.99,
    "description": "Potente laptop...",
    "category": "Electronics",
    "image": "https://picsum.photos/seed/laptop/400/300"
  }
]
```

**POST /api/products**
```json
// Request body
{
  "name": "Nuevo Producto",
  "price": 99.99,
  "description": "Descripción del producto",
  "category": "Electronics"
}
```

---

## Requerimientos del Frontend

### Obligatorios

- [ ] Fetchear y mostrar la lista de productos
- [ ] Implementar buscador/filtro de productos
- [ ] Manejar estados de **Loading** y **Error**
- [ ] Código limpio y organizado

### Puntos Extra

| Categoría | Criterio | Puntos |
|-----------|----------|--------|
| Framework | Usar React o Next.js | +20 |
| TypeScript | Implementar con TypeScript | +15 |
| Testing | Tests unitarios (Vitest/Jest/RTL) | +15 |
| Testing | Tests E2E (Cypress/Playwright) | +10 |
| UX/UI | Diseño responsive | +10 |
| UX/UI | Librería de componentes (MUI, Ant, Shadcn) | +5 |
| Buenas Prácticas | Custom hooks reutilizables | +15 |
| Buenas Prácticas | Estado global (Context/Redux/Zustand) | +15 |
| Buenas Prácticas | Código formateado (Prettier/ESLint) | +10 |
| Funcionalidad | CRUD completo (Create, Update, Delete) | +15 |
| Funcionalidad | Validación de formularios | +10 |
| Funcionalidad | Paginación | +10 |
| Performance | Lazy loading / Code splitting | +10 |
| Deployment | Desplegar frontend (Vercel/Cloudflare Pages - **Gratis, no requiere pago**) | +15 |
| Deployment | Desplegar backend (Cloudflare Workers - **Gratis, no requiere pago**) | +15 |
| Documentación | README con instrucciones claras | +5 |

---

## Criterios de Evaluación

| Criterio | Peso |
|----------|------|
| Calidad del código | 30% |
| Arquitectura y estructura | 25% |
| Funcionalidad | 25% |
| UX/UI | 10% |
| Extras y mejoras | 10% |

---

## Instrucciones de Entrega

1. Crea tu proyecto en la carpeta `/frontend`
2. Incluye un README con instrucciones para correr tu aplicación
3. Haz commit de tu código

¡Buena suerte! 
