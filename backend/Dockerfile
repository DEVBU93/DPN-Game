# ============================================================
# Dockerfile — DevbuPlaytime Backend (Node.js + TypeScript)
# Multi-stage build · Non-root user · Production-ready
# ============================================================

# ── Stage 1: Dependencies ───────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# ── Stage 2: Builder ────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src
COPY prisma ./prisma

RUN npm run build
RUN npx prisma generate

# ── Stage 3: Runner ─────────────────────────────────────────
FROM node:20-alpine AS runner

# Security: create non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 appuser

WORKDIR /app

# Copy built artifacts
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist
COPY --from=builder /app/prisma       ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Environment defaults (override at runtime)
ENV NODE_ENV=production \
    PORT=3001

EXPOSE 3001

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1

CMD ["node", "dist/index.js"]
