# Analizador Inteligente de Contenido de Imágenes

## Descripción del Proyecto

Aplicación web full-stack que permite a los usuarios subir imágenes y obtener un análisis automático de su contenido mediante inteligencia artificial. El sistema utiliza un servicio de IA para identificar y etiquetar elementos presentes en las imágenes, proporcionando etiquetas (tags) con niveles de confianza.

Este proyecto es una prueba técnica de desarrollo full-stack que demuestra habilidades en:
- Diseño y construcción de APIs backend
- Desarrollo de interfaces de usuario interactivas
- Integración con servicios de IA de terceros
- Gestión profesional de código con Git
- Documentación clara y estructurada

## Tecnologías Utilizadas

### Frontend
- **React** v19.2.0 - Biblioteca de JavaScript para construir interfaces de usuario
- **TypeScript** v5.9.3 - Superset tipado de JavaScript
- **Vite** v7.2.2 - Herramienta de construcción y desarrollo rápido
- **Tailwind CSS** v4.1.17 - Framework CSS utility-first
- **PostCSS** v8.5.6 - Procesamiento de CSS

### Herramientas de Desarrollo
- **ESLint** v9.39.1 - Linter para identificar y reportar patrones en código
- **TypeScript ESLint** v8.46.3 - Plugin de ESLint para TypeScript
- **Autoprefixer** v10.4.22 - Plugin de PostCSS para agregar prefijos de navegador

## Estructura del Proyecto

```
kush_fe_image_analizer/
├── public/              # Archivos estáticos públicos
│   ├── robots.txt
│   └── vite.svg
├── src/                 # Código fuente de la aplicación
│   ├── assets/          # Recursos estáticos (imágenes, iconos)
│   ├── components/      # Componentes React reutilizables
│   ├── hooks/           # Custom hooks de React
│   ├── integrations/    # Integraciones con servicios externos
│   ├── lib/             # Utilidades y funciones auxiliares
│   ├── pages/           # Componentes de páginas
│   ├── App.tsx          # Componente principal
│   ├── App.css          # Estilos del componente principal
│   ├── main.tsx         # Punto de entrada de la aplicación
│   └── index.css        # Estilos globales
├── index.html           # HTML principal
├── package.json         # Dependencias y scripts del proyecto
├── tsconfig.json        # Configuración de TypeScript
├── vite.config.ts       # Configuración de Vite
├── tailwind.config.js   # Configuración de Tailwind CSS
├── postcss.config.js    # Configuración de PostCSS
└── eslint.config.js     # Configuración de ESLint
```

## Requisitos Previos

Antes de instalar y ejecutar el proyecto, asegúrate de tener instalado:

- **Node.js** v18 o superior
- **npm** v9 o superior (viene incluido con Node.js)

Puedes verificar las versiones instaladas ejecutando:

```bash
node --version
npm --version
```

## Instalación

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd kush_fe_image_analizer
```

2. Instala las dependencias del frontend:

```bash
npm install
```

## Configuración de Variables de Entorno

La aplicación requiere conexión con el backend API. Crea un archivo `.env` en la raíz del proyecto frontend:

```bash
# .env
VITE_API_URL=http://localhost:3000
```

**Nota**: Asegúrate de que el archivo `.env` esté incluido en el `.gitignore` para no exponer configuraciones sensibles.

## Ejecución del Proyecto

### Modo Desarrollo

Para ejecutar el frontend en modo desarrollo con hot reload:

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Construcción para Producción

Para crear una versión optimizada para producción:

```bash
npm run build
```

Los archivos compilados se generarán en el directorio `dist/`.

### Vista Previa de la Construcción

Para previsualizar la construcción de producción localmente:

```bash
npm run preview
```

### Linting

Para ejecutar el linter y verificar la calidad del código:

```bash
npm run lint
```

## Funcionalidades del Frontend

- **Carga de Imágenes**: Interfaz intuitiva para seleccionar y subir archivos de imagen
- **Indicador de Progreso**: Feedback visual mientras la imagen es procesada
- **Visualización de Resultados**: Muestra la imagen cargada junto con las etiquetas identificadas
- **Niveles de Confianza**: Cada etiqueta incluye un porcentaje de confianza del análisis
- **Diseño Responsivo**: Interfaz adaptable a diferentes tamaños de pantalla

## Integración con el Backend

El frontend se comunica con el backend mediante el endpoint:

```
POST /api/analyze
```

**Request**: Envía la imagen como `multipart/form-data`

**Response**: Recibe un JSON con el siguiente formato:

```json
{
  "tags": [
    { "label": "Perro", "confidence": 0.98 },
    { "label": "Golden Retriever", "confidence": 0.95 },
    { "label": "Parque", "confidence": 0.91 },
    { "label": "Césped", "confidence": 0.88 }
  ]
}
```

## Desarrollo

### Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Previsualiza la construcción de producción |
| `npm run lint` | Ejecuta el linter de código |

### Convenciones de Código

- Utilizar TypeScript para aprovechar el tipado estático
- Seguir las reglas de ESLint configuradas
- Mantener componentes pequeños y reutilizables
- Utilizar hooks personalizados para lógica compartida
- Documentar funciones complejas con comentarios

## Próximos Pasos

- [ ] Implementar componente de carga de imágenes
- [ ] Crear servicio de comunicación con el backend
- [ ] Desarrollar componente de visualización de resultados
- [ ] Agregar manejo de errores y validaciones
- [ ] Implementar tests unitarios
- [ ] Mejorar la experiencia de usuario con animaciones
- [ ] Optimizar para rendimiento y accesibilidad

## Notas de Desarrollo

Este proyecto utiliza Vite como herramienta de construcción, lo que proporciona:
- Inicio de servidor de desarrollo extremadamente rápido
- Hot Module Replacement (HMR) instantáneo
- Optimización de producción con Rollup
- Soporte nativo para TypeScript

## Licencia

Este proyecto es parte de una prueba técnica y es de uso privado.

## Autor

Desarrollado como parte de la prueba técnica Full-Stack con IA