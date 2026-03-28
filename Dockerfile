FROM node:22-bookworm-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci


FROM node:22-bookworm-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm run build


FROM node:22-bookworm-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN useradd --create-home --shell /usr/sbin/nologin appuser

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

RUN mkdir -p /app/logs && chown -R appuser:appuser /app

EXPOSE 3000
USER appuser

CMD ["node", "dist/index.js"]
