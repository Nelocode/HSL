FROM nginx:alpine

# Metadatos del contenedor
LABEL maintainer="Hogar San Lucas <contacto@hogarsanlucas.com>"
LABEL description="Landing Page Oficial de Hogar San Lucas (Medellín)"

# Reemplazar configuración default de Nginx con configuración optimizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos de la landing page
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

# Healthcheck para Easypanel y Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1

# Exponer puerto HTTP
EXPOSE 80

# Iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
