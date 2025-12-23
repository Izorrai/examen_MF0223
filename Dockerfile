# Etapa de construcción (Build)
# Construcción del proyecto para producción
FROM node:24-alpine AS builder

# Cambiar de directorio actual dentro del contenedor a /app
WORKDIR /app

# Copiar los ficheros de dependencias al contenedor
COPY package*.json ./

# Generación de node_modules (clean install)
RUN npm ci

# Copia del resto del proyecto al contenedor
COPY . .

# Generación del build de producción
RUN npm run build


# Etapa de producción (Runtime)

# Imagen de NginX (Servidor web ligero y rápido) sobre Alpine Linux
FROM nginx:alpine

# Copiamos el build al directorio público de Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Exponemos el puerto 80
EXPOSE 80


