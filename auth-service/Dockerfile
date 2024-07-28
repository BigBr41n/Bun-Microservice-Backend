FROM oven/bun:latest

WORKDIR /auth-app
COPY package.json ./
COPY bun.lockb ./
COPY . ./
RUN bun install

EXPOSE 3002
EXPOSE 9100
CMD ["bun", "run", "server.ts"]