import { WinstonLogger as WinstonLoggerService } from '../logger/logger'
import { ILoggerService } from '../logger/interfaces'
import { IConfigurationService } from '../configuration/interfaces'
import { ConfigurationService } from '../configuration/configuration'
import { IMongoDBServise } from '../db/interfaces'
import { MongoDBServise } from '../db/mongodb'
import { TodoStorageService } from '../storage/todoStorage'
import { ITodoStorageService } from '../storage/interface'
import { IExpressService } from '../express/interface'
import { ExpressService } from '../express'
import { ITodoRouterService } from '../router/interface'
import { TodoRouterServise } from '../router/todoRouter'

export class TestServer {

  loggerService: ILoggerService
  configurationService: IConfigurationService
  mongoDBService: IMongoDBServise
  todoStorageService: ITodoStorageService
  expressService: IExpressService
  todoRouterService: ITodoRouterService

  constructor() {
    this.loggerService = new WinstonLoggerService()
    this.configurationService = new ConfigurationService(this.loggerService)
    
    this.mongoDBService = new MongoDBServise(this.loggerService, this.configurationService)
    this.todoStorageService = new TodoStorageService(this.mongoDBService, this.loggerService, this.configurationService)

    this.expressService = new ExpressService(this.loggerService, this.configurationService)
    this.todoRouterService = new TodoRouterServise(this.loggerService, this.todoStorageService)

    this.expressService.use('/api', this.todoRouterService.getRouter())
  }

  async init() {
    console.log('Application start!')
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
    await this.expressService.finally()
    await this.mongoDBService.finally()
  }
}