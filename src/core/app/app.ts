import { WinstonLogger as WinstonLoggerService } from '../logger/logger'
import { ILoggerService } from '../logger/interfaces'
import { IConfigurationService } from '../configuration/interfaces'
import { ConfigurationService } from '../configuration/configuration'
import { IMongoDBServise } from '../db/interfaces'
import { MongoDBServise } from '../db/mongodb'

export class TestServer {

  loggerService: ILoggerService

  configurationService: IConfigurationService

  mongoDBService: IMongoDBServise

  constructor() {
    this.configurationService = new ConfigurationService()

    this.loggerService = new WinstonLoggerService()
    this.mongoDBService = new MongoDBServise(this.loggerService, this.configurationService)

  }

  async init() {
    try {
      this.loggerService.init()
      this.configurationService.init()
      this.mongoDBService.init()
    } catch (error) {
      console.log(error)
      process.exit()
    }

  }
}