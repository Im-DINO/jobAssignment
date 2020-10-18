import winston,{format}  from "winston";
const { combine, timestamp, label, prettyPrint, printf, } = format;

const logFormat = printf(info => {
  return `${info.level}: ${info.timestamp} | ${info.message} | `;
});

export const logger = winston.createLogger({
  level: 'info',
  format: combine(
    winston.format.colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
  ],
})

logger.exitOnError = false;

export const loggerInfo=( status:any, requestURL:any, msg?:string|null,) => {
  return logger.info(` [${status} | ${requestURL}]: ${msg}`);
};








/*

export const options = {
    file: {
      level: 'info',
      filename: `./src/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'info',
      handleExceptions: true,
      json: true,
      colorize: true,
    },
  };
  */
/*
const winstonLogger = new winston.loggers({
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });
*/
