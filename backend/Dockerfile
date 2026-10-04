FROM node:20-alpine

WORKDIR /app

# Install dependencies first (cache layer)
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy source
COPY backend/ ./

EXPOSE 3001

CMD ["node", "src/index.js"]