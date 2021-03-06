import { MongoClient, Db } from 'mongodb'
import { IConfigurationService } from '../configuration/interfaces'
import { ILoggerService } from '../logger/interfaces'
import { IMongoDBServise } from './interfaces'

export class MongoDBServise implements IMongoDBServise {
  // Можно сделать здесь пул клиентов
  private connectionUri: string | undefined
  private mongoClient: MongoClient | undefined

  private loggerService: ILoggerService
  private configurationService: IConfigurationService

  constructor(loggerService: ILoggerService, configurationService: IConfigurationService) {
    this.loggerService = loggerService
    this.configurationService = configurationService
  }

  async init() {
    this.loggerService.logWarn('Reading configuration MongoDB...')
    this.connectionUri = this.configurationService.getConfiguration('MongoDB').uri

    if (!this.connectionUri) {
      this.loggerService.logError('Error reading configuration for MongoDB! There is not "MongoDB.uri" in config.')
      throw new Error('Error reading configuration!')
    }

    this.loggerService.logWarn('Attempt to connect to MongoDB...')
 
    try {
      this.mongoClient = new MongoClient(this.connectionUri)
      await this.mongoClient.connect()
      this.loggerService.logInfo('Successfully connected to MongoDB!')
    } catch (error) {
      this.loggerService.logError('Connection to MongoDB failed!\n'+ error)
      throw new Error('Connection to MongoDB failed!\n' + error)
    }
  }

  async finally() {
    await this.mongoClient?.close()
    this.loggerService.logInfo('Database connection closed successfully.')
  }

  getDatabase(databaseName: string): Db {
    if (this.mongoClient) {
      return this.mongoClient.db(databaseName)
    } else {
      throw new Error('Service not initialized!')
    }
  }
}