var winston = require('winston');

function logProvider() {
  return winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.simple()
    ),
    transports: [new winston.transports.Console()],
  });
}

const PROXY_CONFIG = {
    "/api/*": {
      target: "https://serv.amazingmarvin.com/",
      changeOrigin: true,
      secure: false,
      logLevel: "info",
      logProvider: logProvider
    }
};

module.exports = PROXY_CONFIG;
