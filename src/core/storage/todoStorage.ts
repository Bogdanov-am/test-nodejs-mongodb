import { IMongoDBServise } from "../db/interfaces";
import { ILoggerService } from "../logger/interfaces";
import type { Collection } from 'mongodb'
import { IConfigurationService } from "../configuration/interfaces";

export class TodoStorageService {
  private loggerService: ILoggerService
  private mongoDBService: IMongoDBServise
  private configurationService: IConfigurationService

  private databaseName: string | undefined
  readonly collectionName: string = 'todolist'

  constructor(mongoDBService: IMongoDBServise, loggerService: ILoggerService, configurationService: IConfigurationService) {
    this.loggerService = loggerService
    this.mongoDBService = mongoDBService
    this.configurationService = configurationService
  }

  async init() {
    this.databaseName = this.configurationService.getConfiguration('TodoCollection').databaseName
  }

  async finally() {

  }

  private todoCollection(): Collection {
    if (this.databaseName) {
      return this.mongoDBService.getDatabase(this.databaseName).collection(this.collectionName)
    } else {
      throw new Error('Service not initialized!')
    }
  }
}