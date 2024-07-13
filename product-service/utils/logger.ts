import Logger from "pino";

const log = Logger({
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:HH:mm:ss",
      colorize: true,
    },
  },
  base: {
    pid: false,
  },
});

export default log;