# ============================================
# SpendWise API — Dockerfile
# ============================================
# Multi-stage build:
#   Stage 1 (builder) — installs deps, compiles TypeScript
#   Stage 2 (production) — only copies the COMPILED output
#                            + production dependencies
#
# Why multi-stage? The final image doesn't need
# TypeScript, ts-node, or dev tools — just the
# compiled JavaScript. This makes the final image
# much smaller and more secure.
# ============================================

# ── Stage 1: Builder ──────────────────────────────────
FROM node:20-bookworm-slim AS builder

# Debian slim avoids Alpine/musl OpenSSL incompatibilities
# with Prisma query engines in some environments.
WORKDIR /app

# Prisma query engine needs OpenSSL at generate/runtime detection time.
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl \
	&& rm -rf /var/lib/apt/lists/*

# Copy only package files first
# Docker caches this layer — if package.json doesn't change,
# it won't re-run npm install on every build (much faster)
COPY package*.json ./
COPY prisma ./prisma

# Install ALL dependencies (including dev deps like typescript)
RUN npm install

# Now copy the rest of the source code
COPY . .

# Generate Prisma Client (needed before build)
RUN npx prisma generate

# Compile TypeScript → JavaScript (outputs to /app/dist)
RUN npm run build

# ── Stage 2: Production ──────────────────────────────
FROM node:20-bookworm-slim AS production

WORKDIR /app

# Ensure runtime SSL libs are present for Prisma engine loading.
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl \
	&& rm -rf /var/lib/apt/lists/*

# Copy only package files
COPY package*.json ./
COPY prisma ./prisma

# Install ONLY production dependencies (skip devDependencies)
# Much smaller and faster than installing everything again
RUN npm install --omit=dev

# Regenerate Prisma Client for production stage
RUN npx prisma generate

# Copy the COMPILED code from the builder stage
# We never copy raw .ts files into production — only the built dist/
COPY --from=builder /app/dist ./dist

# Expose the port our Express app listens on
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# The command that runs when the container starts
CMD ["node", "dist/index.js"]