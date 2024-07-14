FROM oven/bun:latest

WORKDIR /orders-app
COPY package.json ./
COPY bun.lockb ./
COPY . ./
RUN bun install

EXPOSE 3006
CMD ["bun", "run", "server.js"]