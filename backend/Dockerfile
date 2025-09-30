# Build
FROM node:22.18.0-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install -g @nestjs/cli@11.0.10
RUN npm ci

COPY . .

RUN npm run build

# Production
FROM node:22.18.0-alpine AS production

WORKDIR /app

RUN npm install -g @nestjs/cli@11.0.10

RUN addgroup -g 2000 appuser && adduser -S -u 2000 -G appuser appuser

RUN apk add --no-cache tini
RUN apk add --no-cache curl

COPY --chown=appuser:appuser --from=builder /app/dist ./dist
COPY --chown=appuser:appuser --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appuser --from=builder /app/package*.json ./
COPY --chown=appuser:appuser --from=builder /app/env.example .env

USER appuser

EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3000/health/status || exit 1

ENV NODE_ENV=development \
    PORT=3000 \
    DYNAMODB_ENDPOINT=http://localstack:4566 \
    DYNAMODB_REGION=us-east-1 \
    LOG_LEVEL=info \
    APP_NAME=streamhub-backend

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/index.js"]