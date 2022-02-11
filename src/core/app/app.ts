import { WinstonLogger as WinstonLoggerService } from '../logger/logger'
import { ILoggerService } from '../logger/interfaces'
import { IConfigurationService } from '../configuration/interfaces'
import { ConfigurationService } from '../configuration/configuration'
import { IMongoDBServise } from '../db/interfaces'
import { MongoDBServise } from '../db/mongodb'
import { TodoStorageService } from '../storage/todo'
import { ITodoStorageService } from '../storage/interface'
import { IExpressService } from '../express/interface'
import { ExpressService } from '../express'
import { todoApiRouter } from '../router/todo'

export class TestServer {

  loggerService: ILoggerService
  configurationService: IConfigurationService
  mongoDBService: IMongoDBServise
  todoStorageService: ITodoStorageService
  expressService: IExpressService

  constructor() {
    this.configurationService = new ConfigurationService()
    this.loggerService = new WinstonLoggerService()
    this.mongoDBService = new MongoDBServise(this.loggerService, this.configurationService)
    this.todoStorageService = new TodoStorageService(this.mongoDBService, this.loggerService, this.configurationService)

    this.expressService = new ExpressService()
    this.expressService.use('/api', todoApiRouter)
  }

  async init() {
    try {
      await this.loggerService.init()
      await this.configurationService.init()
      await this.mongoDBService.init()

      await this.todoStorageService.init()

      await this.expressService.init()
    } catch (error) {
      console.log(error)
      process.exit()
    }

  }

  async finally () {
    await this.mongoDBService.finally()
  }
}