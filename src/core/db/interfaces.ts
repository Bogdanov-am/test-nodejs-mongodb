import { IService } from '../common/interfaces'
import type { Db } from 'mongodb'

export interface IMongoDBServise extends IService {
  getDatabase(databaseName: string): Db
}