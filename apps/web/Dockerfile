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

RUN bunx turbo run build --filter=web...

FROM oven/bun:1.2.22 AS runner
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/web ./apps/web

CMD ["bun", "run", "--cwd", "apps/web", "start"]

