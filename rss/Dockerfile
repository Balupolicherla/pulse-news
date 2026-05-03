FROM node:20-alpine
WORKDIR /app
COPY package.json server.js ./
COPY public/ ./public/
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["node", "server.js"]
