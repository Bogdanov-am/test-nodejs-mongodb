import { ILoggerService } from './interfaces'
import { Logger, createLogger, transports, format } from 'winston'
const { combine, timestamp, label, prettyPrint } = format

export class WinstonLogger implements ILoggerService {
  private logger: Logger

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: combine(
        timestamp(),
        prettyPrint()
      ),
      transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new transports.Console({
        format: format.simple(),
      }));
    }
  }

  async init(): Promise<void> {
    return
  }

  async finally(): Promise<void> {
    return
  }

  logInfo(msg: string): void {
    this.logger.info(msg)
  }

  logError(msg: string): void {
    this.logger.error(msg)
  }

  logWarn(msg: string): void {
    this.logger.warn(msg)
  }
}