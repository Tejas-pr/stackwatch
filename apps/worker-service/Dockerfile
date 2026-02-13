FROM oven/bun:1.2.22 AS base
WORKDIR /app

FROM base AS deps

COPY package.json bun.lock turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN bun install --frozen-lockfile

FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bunx turbo run build --filter=worker-service...

FROM oven/bun:1.2.22 AS runner
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/worker-service ./apps/worker-service

CMD ["bun", "run", "apps/worker-service/index.ts"]
