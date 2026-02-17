# Production multi-stage build for Next.js static export
FROM node:20-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build args for NEXT_PUBLIC_ env vars (injected at build time)
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Production image — serve static files with nginx
FROM nginx:alpine AS runner

COPY --from=builder /app/out /usr/share/nginx/html

# Custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
