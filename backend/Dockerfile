# Multi-stage build for small production image
FROM node:20-alpine AS base
WORKDIR /app

# Install deps only (cached layer)
FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev

# Development stage (with dev deps + watch)
FROM base AS dev
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS prod
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["npm", "start"]