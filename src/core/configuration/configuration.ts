import { ILoggerService } from '../logger/interfaces'
import { IConfigurationService } from './interfaces'
import * as dotenv from 'dotenv'

export class ConfigurationService implements IConfigurationService {
  private configuration: any = {}

  private loggerService: ILoggerService

  constructor(loggerService: ILoggerService) {
    this.loggerService = loggerService
  }

  //TODO: Заглушка, чтение данных из файла либо из переменных среды 
  // Также можно реализовать чтение разных настроек для dev и production сборки
  async init() {
    this.loggerService.logInfo('Start reading application configuration...')

    dotenv.config()

    this.configuration = {
      MongoDB: {
        uri: process.env.DB_CONN_STRING,
      },
      Express: {
        port: 1000,
      },
      TodoStorage: {
        databaseName: 'dev-todo',
      }
    }
    this.loggerService.logInfo('Application config loaded!')
  } 

  async finally() {

  }

  getConfiguration(name: string): any {
    return this.configuration[name]
  }
  
}