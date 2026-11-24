# Hogar San Lucas (HSL) - Landing Page Oficial

Landing page moderna, accesible y de alta conversión para **Hogar San Lucas**, residencia para personas mayores en Medellín, Colombia.

---

## 🚀 Despliegue en Easypanel

Easypanel permite desplegar esta aplicación mediante Docker y GitHub con despliegues automáticos (CI/CD) en cada `git push`.

### Pasos en Easypanel:

1. **Crear o Abrir Proyecto**:
   - En tu panel de Easypanel, crea un nuevo proyecto (ej. `hogar-san-lucas`) o usa uno existente.

2. **Crear Servicio**:
   - Haz clic en **+ Service** -> **App**.
   - Nombre del servicio: `hsl-landing`.

3. **Configurar Origen (GitHub)**:
   - En **Source**, selecciona **GitHub**.
   - Conecta tu cuenta/organización y selecciona el repositorio de este proyecto.
   - Rama (*Branch*): `main`.
   - Activa **Auto Deploy** para que cada cambio que subas a GitHub se compile y publique de inmediato.

4. **Configuración de Build (Docker)**:
   - En **Build Type**, selecciona **Dockerfile**.
   - **Dockerfile Path**: `Dockerfile` (en la raíz).
   - **Context**: `.` (raíz).

5. **Puertos y Red**:
   - En la pestaña **Ports / Domains**:
     - Puerto interno del contenedor: `80`.
     - Asigna tu dominio personalizado (ej. `hogarsanlucas.com` o `www.hogarsanlucas.com`).
     - Easypanel generará automáticamente el certificado SSL gratuito con Let's Encrypt.

6. **Desplegar**:
   - Haz clic en **Deploy**. Easypanel construirá la imagen en menos de 30 segundos con Nginx Alpine y levantará el sitio con compresión Gzip y headers de seguridad.

---

## 🛠️ Ejecución Local con Docker

Si deseas probar el contenedor en tu máquina local antes de subirlo:

```bash
# Opción 1: Usando Docker Compose
docker compose up -d

# Opción 2: Compilar y ejecutar manualmente con Dockerfile
docker build -t hsl-landing:latest .
docker run -d -p 80:80 --name hsl-landing hsl-landing:latest
```

Luego abre en tu navegador:
`http://localhost`

Para detener el contenedor:
```bash
docker compose down
```

---

## 📦 Estructura del Proyecto

```text
├── Dockerfile           # Imagen Nginx Alpine de producción
├── nginx.conf           # Configuración Nginx (Gzip, seguridad, caché)
├── docker-compose.yml   # Orquestación lista para desarrollo y Easypanel
├── .dockerignore        # Excluye zips y archivos fuente pesados del build
├── .gitignore           # Evita subir archivos grandes (15GB de fotos) a GitHub
├── index.html           # Landing page HTML5 semántica y accesible
├── assets/              # Imágenes webp/jpg, videos, SVGs y fuentes Nunito
├── css/                 # Estilos responsive y animaciones
└── js/                  # Interacciones, accesibilidad y cotizador
```
