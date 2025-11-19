# 🏗️ Guía de Arquitectura del Proyecto

**Proyecto**: Analizador Inteligente de Imágenes con IA
**Nivel**: Arquitectura Empresarial

---

## 📋 Resumen Ejecutivo

Este proyecto implementa una arquitectura profesional escalable con:

- ✅ Linters y quality gates automáticos (Prettier, ESLint, Husky)
- ✅ Estructura feature-first modular
- ✅ Sistema de autenticación preparado (AuthContext)
- ✅ CI/CD con GitHub Actions para AWS
- ✅ Componentes reutilizables y utilidades centralizadas

---

## 📂 Estructura del Proyecto

```
src/
├── common/                          # Código compartido
│   └── components/
│       ├── ErrorBoundary/          # Manejo global de errores
│       └── Loading/                # Componente de carga
│
├── components/ui/                   # Componentes base (shadcn)
│
├── constants/                       # Constantes centralizadas
│   ├── api.ts                      # Endpoints y configuración API
│   ├── messages.ts                 # Mensajes de usuario
│   ├── routes.ts                   # Rutas de la app
│   └── validation.ts               # Reglas de validación
│
├── features/                        # Features modulares
│   ├── auth/                       # Autenticación
│   │   ├── components/
│   │   │   └── ProtectedRoute/    # Protección de rutas
│   │   └── context/
│   │       └── AuthContext.tsx    # Estado global de auth
│   │
│   └── image-analyzer/             # Análisis de imágenes
│       ├── components/
│       │   ├── ImageUpload/       # Subida de imágenes
│       │   └── AnalysisResults/   # Visualización de resultados
│       ├── hooks/
│       │   └── useImageAnalyzer.ts
│       └── services/
│           └── imageAnalyzerService.ts
│
├── types/                           # Type declarations globales
├── utils/                           # Utilidades reutilizables
│   ├── validators.ts
│   ├── formatters.ts
│   └── helpers.ts
│
├── App.tsx
└── main.tsx
```

---

## 🔧 Quality Gates Configurados

### Prettier

- **Configuración**: `.prettierrc`
- **Función**: Formato automático del código
- **Reglas**: Comillas simples, 2 espacios, 100 caracteres por línea

### ESLint

- **Configuración**: `eslint.config.js`
- **Plugins**:
  - `eslint-plugin-prettier` - Integración con Prettier
  - `eslint-plugin-jsx-a11y` - Accesibilidad
  - `eslint-plugin-import` - Ordenamiento de imports

### Husky + Lint-Staged

- **Pre-commit hooks**: Ejecuta automáticamente antes de cada commit
  - ESLint fix
  - Prettier format
  - Tests CI
- **Beneficio**: Imposible commitear código con errores

---

## 🎯 Uso de Features

### Autenticación

```typescript
import { useAuth } from '@/features/auth';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    await login('email@example.com', 'password');
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

### Protección de Rutas

```typescript
import { ProtectedRoute } from '@/features/auth';

<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Análisis de Imágenes

```typescript
import { useImageAnalyzer } from '@/features/image-analyzer';

const AnalyzerPage = () => {
  const { analyze, tags, loading } = useImageAnalyzer();

  const handleUpload = async (file: File) => {
    await analyze(file);
  };

  return (
    <div>
      <ImageUpload onSelect={handleUpload} />
      {tags && <AnalysisResults tags={tags} />}
    </div>
  );
};
```

### Constantes

```typescript
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/constants';

fetch(API_ENDPOINTS.LOGIN);
toast.error(ERROR_MESSAGES.LOGIN_FAILED);
```

### Utilidades

```typescript
import { validateEmail, formatFileSize } from '@/utils';

if (!validateEmail(email)) {
  setError('Email inválido');
}

const size = formatFileSize(file.size); // "2.5 MB"
```

---

## 🚀 Scripts NPM

```bash
# Desarrollo
npm run dev                 # Servidor de desarrollo

# Linting y Formato
npm run lint                # Fix linting automático
npm run lint:check          # Solo verificar
npm run format              # Fix formato automático
npm run format:check        # Solo verificar

# Testing
npm run test                # Tests en watch mode
npm run test:ci             # Tests para CI
npm run test:coverage       # Ver cobertura

# Build
npm run build               # Build para producción
npm run preview             # Preview de build
```

---

## 🔄 Workflow de Desarrollo

1. **Crear feature branch**

   ```bash
   git checkout -b feature/mi-funcionalidad
   ```

2. **Desarrollar** - Los pre-commit hooks validan automáticamente

3. **Commit**

   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   # → Automáticamente ejecuta ESLint, Prettier, Tests
   ```

4. **Push y Pull Request**

   ```bash
   git push origin feature/mi-funcionalidad
   ```

   - CI/CD valida: Linting, Tests, Build

5. **Merge a main** → Deploy automático a AWS

---

## 📦 Convenciones de Código

### Estructura de Feature

```
features/[nombre-feature]/
├── components/          # Componentes de UI
├── hooks/              # Custom hooks
├── services/           # Lógica de negocio/API
├── types/              # TypeScript types
└── index.ts            # Barrel export
```

### Imports

- Usar alias `@/` para imports absolutos
- Orden alfabético automático con ESLint
- Agrupar por tipo: externos, internos, relativos

### TypeScript

- Modo gradual (strict: false por ahora)
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- Prefijo `_` para parámetros intencionalmente no usados

### Tests

- Archivos `.test.ts` o `.test.tsx` junto al código
- Carpetas `__tests__/` para múltiples tests
- Coverage mínimo recomendado: 70%

---

## 🌐 CI/CD

Ver documentación completa en: **[DEPLOY_AWS.md](./DEPLOY_AWS.md)**

### Workflows

**CI Pipeline** (`.github/workflows/ci.yml`)

- Trigger: Push/PR a main o develop
- Pasos: Lint → Format → Tests → Build
- Matriz: Node 18.x y 20.x

**Deploy Pipeline** (`.github/workflows/deploy-aws.yml`)

- Trigger: Push a main
- Pasos: Build → S3 → CloudFront invalidation

---

## 📚 Documentación Adicional

- **[GUIA_TECNICA.md](./GUIA_TECNICA.md)** - Guía técnica completa del proyecto
- **[DEPLOY_AWS.md](./DEPLOY_AWS.md)** - Guía de deployment a AWS
- **[README.md](../README.md)** - Inicio rápido

---

## 🎓 Mejores Prácticas Aplicadas

✅ **Feature-first organization** - Modularidad y escalabilidad
✅ **Separation of concerns** - Lógica separada de UI
✅ **DRY principle** - No repetir código
✅ **Barrel exports** - Imports limpios
✅ **Automated quality gates** - Prevenir código malo
✅ **Type safety** - TypeScript gradual
✅ **Error boundaries** - Manejo robusto de errores
✅ **Environment management** - Variables de entorno

---

_Última actualización: 2025-11-18_
