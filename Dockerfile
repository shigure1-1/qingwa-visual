FROM node:22-bookworm-slim AS deps

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder

WORKDIR /app
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_MEDIA_BASE_URL=https://ccc-d9gvvjq7l297a75c4.api.tcloudbasegateway.com/v1/storages/object/public/qingwa-media
ENV NEXT_PUBLIC_MEDIA_BASE_URL=$NEXT_PUBLIC_MEDIA_BASE_URL
ARG NEXT_PUBLIC_SITE_URL=https://qingwa-visual-316501-4-1413812133.sh.run.tcloudbase.com
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:22-bookworm-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_MEDIA_BASE_URL=https://ccc-d9gvvjq7l297a75c4.api.tcloudbasegateway.com/v1/storages/object/public/qingwa-media
ENV NEXT_PUBLIC_SITE_URL=https://qingwa-visual-316501-4-1413812133.sh.run.tcloudbase.com
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
