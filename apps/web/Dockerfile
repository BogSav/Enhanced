# Stage 1: build
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm update && npm ci
COPY . .
RUN npm run build   
    # the upper command will build the project in => /app/dist

# Stage 2: minimal runtine with nginx
FROM nginx:alpine
# Copy the configuration files
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.app.conf /etc/nginx/conf.d/default.conf
# Copy the build artifacts
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]