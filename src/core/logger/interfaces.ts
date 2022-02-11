import { IService } from '../common/interfaces'

export interface ILoggerService extends IService {
  logInfo(msg: string): void
  logWarn(msg: string): void
  logError(msg: string): void
}