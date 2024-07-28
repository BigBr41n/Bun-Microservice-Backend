FROM oven/bun:latest

WORKDIR /product-app
COPY package.json ./
COPY bun.lockb ./
COPY . ./
RUN bun install

EXPOSE 3004
EXPOSE 9101
CMD ["bun", "run", "server.ts"]