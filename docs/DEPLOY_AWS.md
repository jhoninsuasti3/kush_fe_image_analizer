# 🚀 Deployment a AWS

Guía completa para desplegar el proyecto en AWS usando S3 + CloudFront.

---

## 📋 Prerrequisitos

1. **Cuenta de AWS** con permisos para:
   - S3
   - CloudFront
   - IAM

2. **GitHub Repository** con acceso a GitHub Actions

3. **Node.js 18+** instalado localmente

---

## 🏗️ Arquitectura de Deployment

```
GitHub Actions
    ↓
  Build (npm run build)
    ↓
  AWS S3 Bucket (Static Hosting)
    ↓
  CloudFront (CDN Global)
    ↓
  Usuario Final
```

---

## 📦 Paso 1: Configurar S3 Bucket

### Crear S3 Bucket

```bash
# Crear bucket (reemplaza con tu nombre único)
aws s3 mb s3://kush-image-analyzer-frontend --region us-east-1

# Habilitar static website hosting
aws s3 website s3://kush-image-analyzer-frontend \
  --index-document index.html \
  --error-document index.html
```

### Configurar Bucket Policy

Crea un archivo `s3-bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::kush-image-analyzer-frontend/*"
    }
  ]
}
```

Aplicar policy:

```bash
aws s3api put-bucket-policy \
  --bucket kush-image-analyzer-frontend \
  --policy file://s3-bucket-policy.json
```

---

## ☁️ Paso 2: Configurar CloudFront (Opcional pero Recomendado)

### Crear Distribución de CloudFront

```bash
aws cloudfront create-distribution \
  --origin-domain-name kush-image-analyzer-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

### Configuración de Error Pages

Asegúrate de configurar:

- **Error 403**: Redirigir a `/index.html` con código 200 (para SPA routing)
- **Error 404**: Redirigir a `/index.html` con código 200

---

## 🔐 Paso 3: Configurar GitHub Secrets

Ve a `Settings` → `Secrets and variables` → `Actions` en tu repositorio y agrega:

### Secrets Obligatorios

| Secret Name             | Descripción            | Ejemplo                        |
| ----------------------- | ---------------------- | ------------------------------ |
| `AWS_ACCESS_KEY_ID`     | Access Key de IAM User | `AKIAIOSFODNN7EXAMPLE`         |
| `AWS_SECRET_ACCESS_KEY` | Secret Key de IAM User | `wJalrXUtnFEMI/K7MDENG/...`    |
| `AWS_S3_BUCKET`         | Nombre del bucket S3   | `kush-image-analyzer-frontend` |
| `AWS_REGION`            | Región de AWS          | `us-east-1`                    |
| `VITE_API_URL`          | URL de tu backend API  | `https://api.example.com`      |

### Secrets Opcionales

| Secret Name                      | Descripción                                |
| -------------------------------- | ------------------------------------------ |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | ID de CloudFront (para invalidación)       |
| `VITE_API_TOKEN`                 | Token de autenticación del API (si aplica) |

---

## 🔑 Paso 4: Crear IAM User para GitHub Actions

### Policy necesaria

Crea un IAM User con esta policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::kush-image-analyzer-frontend",
        "arn:aws:s3:::kush-image-analyzer-frontend/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "*"
    }
  ]
}
```

Guarda las credenciales (Access Key + Secret Key) para GitHub Secrets.

---

## 🚀 Deployment Automático

### Workflow: CI (Continuous Integration)

**Archivo**: `.github/workflows/ci.yml`

**Triggers**:

- Push a `main` o `develop`
- Pull requests a `main` o `develop`

**Pasos**:

1. Lint check
2. Format check
3. Tests
4. Coverage
5. Build

### Workflow: Deploy to AWS

**Archivo**: `.github/workflows/deploy-aws.yml`

**Triggers**:

- Push a `main` (automático)
- Manual dispatch

**Pasos**:

1. Build con variables de entorno
2. Deploy a S3
3. Invalidar CloudFront cache

---

## 🖥️ Deployment Manual (Opcional)

Si prefieres desplegar manualmente:

```bash
# 1. Build
npm run build

# 2. Deploy a S3
aws s3 sync dist/ s3://kush-image-analyzer-frontend \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "*.map"

# 3. Upload index.html con no-cache
aws s3 cp dist/index.html s3://kush-image-analyzer-frontend/index.html \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

# 4. Invalidar CloudFront (si usas CloudFront)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## 🎯 Estrategia de Cache

### Assets Estáticos (JS, CSS, Images)

```
Cache-Control: public, max-age=31536000, immutable
```

- **Beneficio**: Cache de 1 año (assets tienen hash en nombre)

### index.html

```
Cache-Control: no-cache, no-store, must-revalidate
```

- **Beneficio**: Siempre se descarga la última versión

---

## 🔍 Verificación de Deployment

### 1. Verificar S3

```bash
aws s3 ls s3://kush-image-analyzer-frontend/
```

Deberías ver:

```
index.html
assets/
vite.svg
robots.txt
```

### 2. Verificar Website

```bash
# URL de S3 Website
http://kush-image-analyzer-frontend.s3-website-us-east-1.amazonaws.com

# O URL de CloudFront (si configurado)
https://d111111abcdef8.cloudfront.net
```

### 3. Verificar Variables de Entorno

Abre las DevTools del navegador:

```javascript
console.log(import.meta.env);
```

---

## 🐛 Troubleshooting

### Error: 403 Forbidden

**Solución**: Verifica bucket policy permite acceso público

```bash
aws s3api get-bucket-policy --bucket kush-image-analyzer-frontend
```

### Error: Routes no funcionan (404 en rutas)

**Solución**: Configurar error pages en S3 o CloudFront:

- Error 404 → `/index.html` (código 200)

### Error: Variables de entorno no se cargan

**Solución**: Verifica que los secrets estén configurados en GitHub y que el workflow los pase al build:

```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

### CloudFront cache no se invalida

**Solución**: Verifica que el Distribution ID esté correcto y que el IAM user tenga permisos de `cloudfront:CreateInvalidation`

---

## 📊 Monitoreo

### CloudWatch Logs (CloudFront)

Activa logging en CloudFront para ver:

- Requests
- Errores
- Cache hits/misses

### S3 Metrics

Ve a S3 console → Bucket → Metrics para ver:

- Storage usage
- Request metrics

---

## 💰 Costos Estimados

### S3

- **Storage**: ~$0.023/GB/mes
- **Requests**: ~$0.0004 por 1000 GET requests

### CloudFront

- **Data Transfer**: ~$0.085/GB (primeros 10TB)
- **Requests**: ~$0.0075 por 10,000 HTTP requests

### Total Estimado

Para una aplicación pequeña-mediana:

- **~$5-20/mes**

---

## 🔒 Seguridad

### Recomendaciones

1. **No commitear secrets**: Usa GitHub Secrets
2. **IAM User dedicado**: Crear user solo para CI/CD
3. **Least privilege**: Solo permisos necesarios
4. **Rotate credentials**: Cambiar Access Keys periódicamente
5. **Enable MFA**: Activar MFA en cuenta AWS
6. **HTTPS Only**: Usar CloudFront con certificado SSL

---

## 🔄 Rollback

Si necesitas revertir un deployment:

```bash
# 1. Buscar versión anterior en S3
aws s3api list-object-versions \
  --bucket kush-image-analyzer-frontend

# 2. Restaurar versión específica
aws s3api get-object \
  --bucket kush-image-analyzer-frontend \
  --key index.html \
  --version-id VERSION_ID \
  index.html

# 3. Re-deploy versión anterior
aws s3 cp index.html s3://kush-image-analyzer-frontend/
```

---

## 📚 Recursos

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [GitHub Actions for AWS](https://github.com/aws-actions)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

## ✅ Checklist de Deployment

- [ ] S3 Bucket creado y configurado
- [ ] Bucket policy permite acceso público
- [ ] CloudFront distribution creada (opcional)
- [ ] IAM User creado con permisos correctos
- [ ] GitHub Secrets configurados
- [ ] Workflow de CI funcionando
- [ ] Workflow de Deploy funcionando
- [ ] Variables de entorno configuradas
- [ ] Cache strategy implementada
- [ ] SSL certificate configurado (CloudFront)
- [ ] DNS apuntando a CloudFront (opcional)
- [ ] Monitoreo configurado

---

_Última actualización: 2025-11-18_
_Proyecto: Analizador Inteligente de Imágenes con IA_
