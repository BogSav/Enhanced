# -----------------------------------------------------------------------------
# Multi‑stage Dockerfile for the Enhanced web frontend (production image)
#
# Stage 1 (build):
#   - Uses a Node.js image with npm to install dependencies and compile the
#     optimized production bundle (Vite + TypeScript build pipeline).
#   - `npm ci` ensures a clean, lockfile‑driven, reproducible install.
#   - The result of `npm run build` is placed under /app/dist.
#
# Stage 2 (runtime):
#   - A minimal Nginx base serves the static assets generated in Stage 1.
#   - Custom Nginx configs provide root serving + future extension (gzip, cache
#     headers, SPA fallback). Edit `nginx.app.conf` to adjust behavior.
#   - No Node.js runtime or source code is shipped -> smaller attack surface
#     and image size, immutable artifact delivery.
#
# Potential future improvements:
#   - Add build argument for injecting a COMMIT_SHA (display in footer / headers).
#   - Add integrity verification (e.g. `npm audit --production`).
#   - Add a non-root user in final stage (Nginx can be configured to drop privs).
#   - Add healthcheck (HTTP 200 on /) if orchestrator benefits.
# -----------------------------------------------------------------------------

## ---------- Stage 1: Build the static bundle ----------
FROM node:24-alpine AS build
WORKDIR /app

# Copy only manifests first for better layer caching when source files change
COPY package*.json ./

# Clean install dependencies exactly as locked
RUN npm ci

# Copy the rest of the project (source, configs, assets)
COPY . .

# Build (runs TypeScript project build + Vite production bundling)
RUN npm run build


    
## ---------- Stage 2: Runtime (static file server) ----------
FROM nginx:alpine

# Copy Nginx base and site-specific configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.app.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port (adjust mapping externally if 80 is reserved)
EXPOSE 80

# Run Nginx in the foreground (container-friendly)
CMD ["nginx", "-g", "daemon off;"]