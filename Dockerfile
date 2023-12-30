# Base image with Node.js
FROM node:18-buster AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user and change ownership of necessary files
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs wuser \
    && chown -R wuser:wuser /app

USER wuser

# Copy the build output from the builder stage
COPY --from=builder --chown=wuser:nodejs /app/public ./public

EXPOSE 3001
ENV PORT 3001

CMD ["node", "server.js"]
