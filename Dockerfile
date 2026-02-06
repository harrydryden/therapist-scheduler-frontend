FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force
RUN cd backend && npm ci --only=production && npm cache clean --force && cd ..

# Copy source code
COPY . .

# Generate Prisma client
RUN cd backend && npx prisma generate && cd ..

# Build the backend
RUN cd backend && npm run build && cd ..

# Build the frontend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Copy built application
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/backend/dist ./backend/dist
COPY --from=builder --chown=nodeuser:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=builder --chown=nodeuser:nodejs /app/backend/package.json ./backend/package.json
COPY --from=builder --chown=nodeuser:nodejs /app/prisma ./prisma

USER nodeuser

EXPOSE 3000

# FIX C1: Health check using Node.js (Alpine doesn't have wget/curl by default)
# The health-check.js script makes an HTTP request to /health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node backend/dist/health-check.js || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "backend/dist/server.js"]
