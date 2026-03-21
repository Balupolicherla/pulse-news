# ─────────────────────────────────────────────
#  PULSE — World News Intelligence
#  Container: Node.js 20 Alpine (zero npm deps)
# ─────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy all app files
COPY package.json .
COPY server.js .
COPY env.js .
COPY public/ ./public/

# No npm install needed — zero dependencies!

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
