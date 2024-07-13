const { createLogger, format, transports, config } = require("winston");

// {
//   emerg: 0,
//   alert: 1,
//   crit: 2,
//   error: 3,
//   warning: 4,
//   notice: 5,
//   info: 6,
//   debug: 7
// }

const logger = createLogger({
  levels: config.syslog.levels,
  exitOnError: false,
  format: format.json(),
  transports: [new transports.Console()],
});
module.exports = logger;
