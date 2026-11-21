# Wedding invitation website (Nuxt, node-server preset).
#
#   docker build -t e-invitation-wedding .
#   docker run -p 3000:3000 \
#     -e NUXT_DIRECTUS_URL=http://directus:8055 \
#     -e NUXT_DIRECTUS_TOKEN=... e-invitation-wedding
#
# The Directus URL and token are read at run time (runtimeConfig), so one
# image works for every environment and no secret is baked into it.

# ── build ────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# pnpm 8 matches the repo's lockfile (lockfileVersion 6.0)
RUN corepack enable && corepack prepare pnpm@8.15.9 --activate

# Dependencies first, so this layer is reused until the lockfile changes.
# --ignore-scripts skips the postinstall `nuxt prepare`, which needs the
# source that isn't copied yet; `nuxt build` does that work itself.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .
RUN pnpm build

# ── run ──────────────────────────────────────────────────────────────────────
# .output is self-contained (its own node_modules), so nothing else is copied.
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

COPY --from=build --chown=node:node /app/.output ./.output

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
