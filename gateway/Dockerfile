FROM oven/bun:latest

WORKDIR /gateway
COPY package.json ./
COPY bun.lockb ./
COPY . ./
RUN bun install

EXPOSE 3000
CMD ["bun", "run", "server.js"]