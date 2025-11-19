# Analizador Inteligente de Contenido de Imágenes

Aplicación web full-stack que permite a los usuarios subir imágenes y obtener un análisis automático de su contenido mediante inteligencia artificial.

---

## 🚀 Tecnologías

### Core

- **React** 19.2.0 + **TypeScript** 5.9.3
- **Vite** 7.2.2 - Build tool ultrarrápido
- **Tailwind CSS** 3.4.18 - Styling utility-first

### UI Components

- **shadcn/ui** - Componentes base accesibles
- **Sonner** - Notificaciones toast
- **Lucide React** - Iconografía

### Quality & Testing

- **Prettier** 3.6.2 - Formato automático
- **ESLint** 9.39.1 - Linting profesional
- **Husky** 9.1.7 - Git hooks
- **Jest** 30.2.0 - Testing framework

### DevOps

- **GitHub Actions** - CI/CD automático
- **AWS S3 + CloudFront** - Deployment

---

## 📋 Requisitos Previos

- **Node.js** v18 o superior
- **npm** v9 o superior

```bash
node --version
npm --version
```

---

## ⚡ Inicio Rápido

```bash
# Clonar repositorio
git clone <URL_DEL_REPOSITORIO>
cd kush_fe_image_analizer

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz:

```bash
VITE_API_URL=http://localhost:3000
VITE_API_TOKEN=tu-token-opcional
```

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev                 # Servidor de desarrollo (puerto 5173)

# Build
npm run build               # Compilar para producción
npm run preview             # Preview del build

# Quality
npm run lint                # Fix linting automático
npm run lint:check          # Solo verificar
npm run format              # Fix formato automático
npm run format:check        # Solo verificar formato

# Testing
npm run test                # Tests en watch mode
npm run test:ci             # Tests para CI (sin watch)
npm run test:coverage       # Generar reporte de cobertura
```

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── common/              # Componentes compartidos (ErrorBoundary, Loading)
├── components/ui/       # Componentes base (shadcn)
├── constants/           # Constantes centralizadas (API, mensajes, rutas)
├── features/            # Features modulares
│   ├── auth/           # Autenticación (Context, ProtectedRoute)
│   └── image-analyzer/ # Análisis de imágenes (Upload, Results)
├── types/               # TypeScript type declarations
├── utils/               # Utilidades (validators, formatters, helpers)
├── App.tsx
└── main.tsx
```

**Arquitectura Feature-First**: Cada feature es autocontenida con sus componentes, hooks, services y tests.

Ver guía completa en: **[docs/GUIA_ARQUITECTURA.md](./docs/GUIA_ARQUITECTURA.md)**

---

## ✨ Características

### Frontend

- ✅ **Drag & Drop** para subir imágenes
- ✅ **Preview** de imagen cargada
- ✅ **Análisis con IA** y visualización de tags
- ✅ **Niveles de confianza** por cada etiqueta
- ✅ **Diseño responsivo** con Tailwind CSS
- ✅ **Error boundaries** para manejo robusto de errores
- ✅ **Loading states** y feedback visual

### Arquitectura Profesional

- ✅ **Quality gates automáticos** (Prettier, ESLint, Husky)
- ✅ **Pre-commit hooks** - Imposible commitear código con errores
- ✅ **Sistema de autenticación** preparado (AuthContext + ProtectedRoute)
- ✅ **CI/CD** con GitHub Actions
- ✅ **Deploy automático** a AWS S3 + CloudFront
- ✅ **TypeScript** con tipado gradual
- ✅ **Estructura modular** escalable

---

## 🔐 Autenticación

El proyecto incluye un sistema de autenticación preparado:

```typescript
import { useAuth } from '@/features/auth';

const { user, login, logout, isAuthenticated } = useAuth();
```

**Nota**: Actualmente usa mock data. Conectar con backend real implementando los servicios en `features/auth/services/`.

---

## 🖼️ Integración con Backend

### Endpoint de Análisis

```
POST /api/analyze
Content-Type: multipart/form-data
```

**Request**: Imagen como form-data

**Response**:

```json
{
  "tags": [
    { "label": "Perro", "confidence": 0.98 },
    { "label": "Golden Retriever", "confidence": 0.95 },
    { "label": "Parque", "confidence": 0.91 }
  ]
}
```

---

## 🚀 Deployment

### Deployment Automático (GitHub Actions)

1. **Push a `main`** → Deploy automático a AWS
2. Ver configuración completa en: **[docs/DEPLOY_AWS.md](./docs/DEPLOY_AWS.md)**

### Secrets Requeridos (GitHub)

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_S3_BUCKET
AWS_REGION
VITE_API_URL
```

### Build Manual

```bash
npm run build
# Archivos generados en dist/
```

---

## 🧪 Testing

```bash
# Ejecutar tests
npm run test

# Modo CI (sin watch)
npm run test:ci

# Con cobertura
npm run test:coverage
```

Los tests están organizados junto al código fuente:

- Archivos `*.test.ts` o `*.test.tsx`
- Carpetas `__tests__/` para múltiples tests

---

## 📚 Documentación

- **[GUIA_ARQUITECTURA.md](./docs/GUIA_ARQUITECTURA.md)** - Arquitectura y convenciones
- **[GUIA_TECNICA.md](./docs/GUIA_TECNICA.md)** - Guía técnica completa del proyecto
- **[DEPLOY_AWS.md](./docs/DEPLOY_AWS.md)** - Guía de deployment a AWS

---

## 🔄 Workflow de Desarrollo

1. **Crear branch**

   ```bash
   git checkout -b feature/mi-funcionalidad
   ```

2. **Desarrollar** - Los hooks validan automáticamente

3. **Commit**

   ```bash
   git commit -m "feat: descripción del cambio"
   # → Auto-ejecuta: ESLint, Prettier, Tests
   ```

4. **Push y PR**

   ```bash
   git push origin feature/mi-funcionalidad
   ```

   CI valida: Linting, Tests, Build

5. **Merge a main** → Deploy automático a AWS ✨

---

## 🎯 Próximos Pasos

- [ ] Conectar AuthContext con backend real
- [ ] Implementar formularios de Login/Register
- [ ] Instalar react-router-dom para routing
- [ ] Agregar más tests (cobertura >70%)
- [ ] Configurar AWS S3 y CloudFront
- [ ] Implementar manejo de sesiones
- [ ] Agregar analytics

---

## 📝 Convenciones

### Commits

Usar conventional commits:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en build, deps, etc.

### Code Style

- **Formato automático** con Prettier
- **Linting automático** con ESLint
- **Imports ordenados** alfabéticamente
- **TypeScript** para todo el código nuevo

---

## 👥 Autor

Desarrollado como prueba técnica Full-Stack con IA

---

## 📄 Licencia

Uso privado - Prueba técnica
