# Braces & Faces public website (BNF) — same pattern as the other clinic sites: multi-stage, node:20-alpine,
# Next.js standalone output, non-root user, port 3000. No backend, no secrets.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_ENV=production
ARG NEXT_PUBLIC_SITE_URL=
ARG NEXT_PUBLIC_NOINDEX=false
ARG NEXT_PUBLIC_SHOW_DRAFT_BADGES=
ENV NEXT_PUBLIC_SITE_ENV=$NEXT_PUBLIC_SITE_ENV \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_NOINDEX=$NEXT_PUBLIC_NOINDEX \
    NEXT_PUBLIC_SHOW_DRAFT_BADGES=$NEXT_PUBLIC_SHOW_DRAFT_BADGES \
    NEXT_TELEMETRY_DISABLED=1
# prebuild = scripts/prepare-images.mjs (WebP + icons from images/), then next build
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME="0.0.0.0" NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S bnf && adduser -S bnf -G bnf
COPY --from=builder --chown=bnf:bnf /app/.next/standalone ./
COPY --from=builder --chown=bnf:bnf /app/.next/static ./.next/static
COPY --from=builder --chown=bnf:bnf /app/public ./public
USER bnf
EXPOSE 3000
CMD ["node", "server.js"]
