# 📦 Product Management Dashboard / Panel de Gestión de Productos

[![English](https://img.shields.io/badge/Language-English-blue)](#english) [![Español](https://img.shields.io/badge/Idioma-Español-red)](#español)

A professional, modern, and robust product management application built with the latest web technologies. / Una aplicación profesional, moderna y robusta para la gestión de productos, construida con las últimas tecnologías web.

---

<a id="english"></a>
## 🇺🇸 English Version

### 🚀 Overview
This application allows users to manage a list of products with a full CRUD (Create, Read, Update, Delete) lifecycle. It features a responsive design, dark/light mode support, and seamless English/Spanish translation. The architecture focuses on maintainability, scalability, and performance, leveraging **Next.js 16** and **React 19**.

### ✨ Key Features
- **Product Management**: Create, Read, Update, and Delete products seamlessly.
- **Advanced Search**: Real-time filtering with debounced search.
- **Infinite Scrolling**: Optimized performance for large datasets using `useInfiniteQuery`.
- **Internationalization (i18n)**: Full support for English (`en`) and Spanish (`es`).
- **Theming**: System-aware Dark and Light modes.
- **Form Validation**: Robust client-side validation using Zod and React Hook Form.
- **Responsive Design**: Mobile-first approach using Tailwind CSS 4.
- **Accessibility**: Built with accessible components (Radix UI) ensuring keyboard navigation and screen reader support.

### 🛠️ Technology Stack
- **Core**: [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS 4](https://tailwindcss.com/).
- **State & Data**: [TanStack Query v5](https://tanstack.com/query/latest), [Zustand](https://zustand-demo.pmnd.rs/).
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/).
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/).
- **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/), [Playwright](https://playwright.dev/).

### ⚙️ Installation
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd frontend/prueba_veronicas
   ```
2. **Install dependencies:**
   ```bash
   bun install
   # or npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
4. **Backend Setup (Cloudinary):**
   The backend allows image uploads via Cloudinary.
   - Create a **free account** at [Cloudinary](https://cloudinary.com/).
   - Get your `Cloud Name`, `API Key`, and `API Secret` from the dashboard.
   - Add them to the `backend/.env` file:
     ```env
     DATABASE_URL=Connection string
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

### ▶️ Running the Application
```bash
bun dev
# or npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 🧪 Running Tests
- **Unit Tests**: `bun test` or `npm test`
- **E2E Tests**: `bun run test:e2e` (Requires backend running)

---

<a id="español"></a>
## 🇪🇸 Versión en Español

### 🚀 Visión General
Esta aplicación permite a los usuarios gestionar una lista de productos con un ciclo de vida CRUD completo (Crear, Leer, Actualizar, Eliminar). Cuenta con un diseño responsivo, soporte para modo oscuro/claro y traducción fluida entre inglés y español. La arquitectura se centra en la mantenibilidad, escalabilidad y rendimiento, aprovechando **Next.js 16** y **React 19**.

### ✨ Características Principales
- **Gestión de Productos**: Crea, lee, actualiza y elimina productos sin problemas.
- **Búsqueda Avanzada**: Filtrado en tiempo real con búsqueda "debounced".
- **Scroll Infinito**: Rendimiento optimizado para grandes conjuntos de datos usando `useInfiniteQuery`.
- **Internacionalización (i18n)**: Soporte completo para Inglés (`en`) y Español (`es`).
- **Temas**: Modos Claro y Oscuro detectados por el sistema.
- **Validación de Formularios**: Validación robusta del lado del cliente usando Zod y React Hook Form.
- **Diseño Responsivo**: Enfoque "Mobile-first" utilizando Tailwind CSS 4.
- **Accesibilidad**: Construido con componentes accesibles (Radix UI) asegurando navegación por teclado y soporte para lectores de pantalla.

### 🛠️ Stack Tecnológico
- **Núcleo**: [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS 4](https://tailwindcss.com/).
- **Estado y Datos**: [TanStack Query v5](https://tanstack.com/query/latest), [Zustand](https://zustand-demo.pmnd.rs/).
- **Componentes UI**: [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/).
- **Formularios y Validación**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/).
- **Pruebas**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/), [Playwright](https://playwright.dev/).

### ⚙️ Instalación
1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd frontend/prueba_veronicas
   ```
2. **Instalar dependencias:**
   ```bash
   bun install
   # o npm install
   ```
3. **Configurar Variables de Entorno:**
   Crea un archivo `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
4. **Configuración del Backend (Cloudinary):**
   El backend permite la subida de imágenes a través de Cloudinary.
   - Crea una **cuenta gratuita** en [Cloudinary](https://cloudinary.com/).
   - Obtén tu `Cloud Name`, `API Key` y `API Secret` desde el panel de control.
   - Agrégalos al archivo `backend/.env`:
     ```env
     DATABASE_URL=Texto de conexion
     CLOUDINARY_CLOUD_NAME=tu_cloud_name
     CLOUDINARY_API_KEY=tu_api_key
     CLOUDINARY_API_SECRET=tu_api_secret
     ```

### ▶️ Ejecutar la Aplicación
```bash
bun dev
# o npm run dev
```
Abre [http://localhost:3000](http://localhost:3000).

### 🧪 Ejecutar Pruebas
- **Pruebas Unitarias**: `bun test` o `npm test`
- **Pruebas E2E**: `bun run test:e2e` (Requiere que el backend esté ejecutándose)

---

## 🏗️ Design Decisions / Decisiones de Diseño

1. **Atomic Design**: UI logic separated via Custom Hooks (`useProductForm`). / Lógica de UI separada mediante Custom Hooks.
2. **Page Object Model (POM)**: Maintained E2E tests for scalability. / Pruebas E2E mantenibles para escalabilidad.
3. **Optimistic Updates**: Immediate user feedback with React Query. / Feedback inmediato al usuario con React Query.
4. **Bilingual Layout**: Native i18n routing. / Enrutamiento i18n nativo.

## 🤝 Contributors / Colaboradores

- **William Quijano** - *Full Stack Developer*

---
Built with ❤️ using Next.js 16.
