# 📖 Guía Técnica del Proyecto

**Proyecto**: Analizador Inteligente de Imágenes con IA
**Última actualización**: 2025-11-18

---

## 🎯 Resumen del Proyecto

Aplicación web con arquitectura profesional lista para:

- ✅ Desarrollo escalable en equipo
- ✅ Sistema de autenticación preparado
- ✅ Deployment automático a AWS
- ✅ Quality gates automáticos
- ✅ Mantenimiento a largo plazo

---

## 🏗️ Arquitectura Implementada

### 1. Quality Gates Automáticos

**Prettier + ESLint + Husky**

- Formato automático de código
- Reglas de linting profesionales (a11y, imports, TypeScript)
- Pre-commit hooks que previenen código con errores
- Imposible hacer commit sin pasar validaciones

**Scripts Mejorados**

```bash
npm run lint          # Fix automático
npm run lint:check    # Solo verificar
npm run format        # Fix formato
npm run format:check  # Solo verificar
npm run test:ci       # Tests para CI
npm run test:coverage # Cobertura
```

### 2. Estructura Feature-First

```
src/
├── common/              # Componentes compartidos
│   └── components/
│       ├── ErrorBoundary/   # Manejo global de errores
│       └── Loading/         # Loading universal
│
├── constants/           # Constantes centralizadas
│   ├── api.ts          # Endpoints y config API
│   ├── messages.ts     # Mensajes de usuario
│   ├── routes.ts       # Rutas de navegación
│   └── validation.ts   # Reglas de validación
│
├── utils/               # Utilidades reutilizables
│   ├── validators.ts   # Validación de emails, archivos, etc.
│   ├── formatters.ts   # Formato de tamaños, fechas, etc.
│   └── helpers.ts      # Funciones auxiliares
│
├── features/            # Features modulares
│   ├── auth/           # Autenticación
│   │   ├── components/
│   │   │   └── ProtectedRoute/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── index.ts
│   │
│   └── image-analyzer/ # Análisis de imágenes
│       ├── components/
│       │   ├── ImageUpload/
│       │   └── AnalysisResults/
│       ├── hooks/
│       │   └── useImageAnalyzer.ts
│       ├── services/
│       │   └── imageAnalyzerService.ts
│       └── index.ts
│
└── types/               # Type declarations globales
    └── lucide-react.d.ts
```

### 3. Sistema de Autenticación

**AuthContext** - Estado global de autenticación

- Login/Logout/Register preparados
- Persistencia de tokens en localStorage
- Loading states
- Actualmente usa mock data (listo para conectar con backend)

**ProtectedRoute** - Protección de rutas

- Valida autenticación antes de renderizar
- Redirige a login si no autenticado
- Loading durante verificación
- Preparado para react-router-dom

### 4. CI/CD con GitHub Actions

**Workflow CI** (`.github/workflows/ci.yml`)

- **Trigger**: Push/PR a `main` o `develop`
- **Matriz**: Node 18.x y 20.x
- **Pasos**:
  1. Lint check (ESLint)
  2. Format check (Prettier)
  3. Tests (Jest)
  4. Coverage report
  5. Build (Vite)

**Workflow Deploy** (`.github/workflows/deploy-aws.yml`)

- **Trigger**: Push a `main` (automático)
- **Pasos**:
  1. Build con variables de entorno
  2. Deploy a S3
  3. Invalidación de cache CloudFront

### 5. Fixes Técnicos Aplicados

**lucide-react Icons**

- Creado `src/types/lucide-react.d.ts` con type declarations
- Resuelve problemas de module resolution con TypeScript bundler mode
- Build exitoso verificado

**TypeScript Configuration**

- Modo gradual (strict: false)
- Tests excluidos del build de producción
- Parámetros no usados prefijados con `_`

---

## 🔐 GitHub Secrets Requeridos

Para CI/CD, configurar en: `Settings` → `Secrets and variables` → `Actions`

| Secret                           | Descripción                | Requerido   |
| -------------------------------- | -------------------------- | ----------- |
| `AWS_ACCESS_KEY_ID`              | Access key de IAM          | ✅          |
| `AWS_SECRET_ACCESS_KEY`          | Secret key de IAM          | ✅          |
| `AWS_S3_BUCKET`                  | Nombre del bucket S3       | ✅          |
| `AWS_REGION`                     | Región AWS (ej: us-east-1) | ✅          |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | ID de CloudFront           | ⭕ Opcional |
| `VITE_API_URL`                   | URL del backend            | ✅          |
| `VITE_API_TOKEN`                 | Token de autenticación     | ⭕ Opcional |

---

## 💡 Guías de Uso

### Usar Autenticación

```typescript
import { useAuth } from '@/features/auth';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    await login('user@example.com', 'password');
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

### Proteger Rutas

```typescript
import { ProtectedRoute } from '@/features/auth';

// Envuelve componentes que requieren autenticación
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>
```

### Análisis de Imágenes

```typescript
import { useImageAnalyzer } from '@/features/image-analyzer';

const AnalyzerPage = () => {
  const { analyze, tags, loading, error } = useImageAnalyzer();

  const handleUpload = async (file: File) => {
    await analyze(file);
  };

  return (
    <div>
      <ImageUpload onSelect={handleUpload} />
      {loading && <Loading />}
      {error && <ErrorMessage error={error} />}
      {tags && <AnalysisResults tags={tags} />}
    </div>
  );
};
```

### Usar Constantes

```typescript
import { API_ENDPOINTS, ERROR_MESSAGES, VALIDATION_RULES } from '@/constants';

// API calls
fetch(API_ENDPOINTS.LOGIN);

// Mensajes de usuario
toast.error(ERROR_MESSAGES.LOGIN_FAILED);

// Validación
if (file.size > VALIDATION_RULES.IMAGE.MAX_SIZE) {
  alert(ERROR_MESSAGES.FILE_TOO_LARGE);
}
```

### Usar Utilidades

```typescript
import { validateEmail, formatFileSize, debounce } from '@/utils';

// Validación
if (!validateEmail(email)) {
  setError('Email inválido');
}

// Formateo
const size = formatFileSize(file.size); // "2.5 MB"

// Debounce
const debouncedSearch = debounce(handleSearch, 300);
```

---

## 🔄 Workflow de Desarrollo

### 1. Crear Feature Branch

```bash
git checkout -b feature/nombre-descriptivo
```

### 2. Desarrollar

Los pre-commit hooks validan automáticamente:

- ESLint fix
- Prettier format
- Tests en modo CI

### 3. Commit

```bash
git add .
git commit -m "feat: descripción del cambio"
# → Automáticamente ejecuta hooks
```

**Convenciones de Commit**:

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Cambios en build/deps

### 4. Push y Pull Request

```bash
git push origin feature/nombre-descriptivo
```

El CI ejecuta automáticamente:

- ✅ Linting
- ✅ Format check
- ✅ Tests
- ✅ Build

### 5. Merge a `main`

Deploy automático a AWS S3 + CloudFront 🚀

---

## ✅ Estado Actual del Proyecto

### Completado

✅ **Quality Gates**

- Prettier configurado
- ESLint profesional
- Husky + lint-staged funcionando
- Scripts NPM completos

✅ **Arquitectura**

- Estructura feature-first
- Constants centralizadas
- Utils reutilizables
- Common components (ErrorBoundary, Loading)

✅ **Auth Feature**

- AuthContext implementado
- useAuth hook
- ProtectedRoute component
- Token persistence (mock)

✅ **Image Analyzer Feature**

- ImageUpload con drag & drop
- AnalysisResults con visualización
- useImageAnalyzer hook
- imageAnalyzerService

✅ **CI/CD**

- Workflow CI configurado
- Workflow Deploy AWS configurado
- Multi-node testing (18 + 20)

✅ **Build**

- Build exitoso verificado
- lucide-react icons resueltos
- TypeScript configurado correctamente

### Pendiente (Próximos Pasos)

⏳ **Autenticación Real**

- Implementar auth services con backend
- Formularios de Login/Register UI
- Manejo de tokens real
- Refresh token logic

⏳ **Routing**

- Instalar react-router-dom
- Configurar rutas
- Activar Navigate en ProtectedRoute

⏳ **Testing**

- Aumentar cobertura de tests
- Tests para utils y constants
- Tests de integración

⏳ **AWS Setup**

- Crear bucket S3
- Configurar CloudFront
- Setup IAM policies
- Configurar GitHub Secrets

⏳ **Mejoras Opcionales**

- TypeScript strict mode 100%
- Monitoreo con Sentry
- Analytics
- i18n

---

## 📚 Documentación Relacionada

- **[README.md](../README.md)** - Inicio rápido del proyecto
- **[GUIA_ARQUITECTURA.md](./GUIA_ARQUITECTURA.md)** - Arquitectura y convenciones
- **[DEPLOY_AWS.md](./DEPLOY_AWS.md)** - Guía de deployment a AWS

---

## 🎓 Mejores Prácticas Aplicadas

**Arquitectura**

- Feature-first organization (modularidad)
- Separation of concerns (UI vs lógica)
- DRY principle (no repetir código)
- Barrel exports (imports limpios)

**Quality**

- Automated linting y formatting
- Pre-commit hooks (prevenir código malo)
- TypeScript gradual (tipado progresivo)
- Test organization (junto al código)

**DevOps**

- CI/CD automation
- Environment variables management
- AWS deployment ready
- Cache strategies

**State Management**

- Context API para auth global
- Custom hooks para features
- Local state cuando es apropiado

---

_Última actualización: 2025-11-18_
_Nivel: Arquitectura Profesional_
