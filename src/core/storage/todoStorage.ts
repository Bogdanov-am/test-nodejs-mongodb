import { IMongoDBServise } from '../db/interfaces'
import { ILoggerService } from '../logger/interfaces'
import type { Collection } from 'mongodb'
import { IConfigurationService } from '../configuration/interfaces'
import { ITodoStorageService, Task } from './interface'
import { ObjectId } from 'mongodb'

export class RequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RequestError'
  }
}

export class NoMatchesError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NoMatchesError'
  }
}

export class AccessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AccessError'
  }
}

export class TodoStorageService implements ITodoStorageService {
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
    
    this.databaseName = this.configurationService.getConfiguration('TodoStorage').databaseName
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

  async getTasks(userId: string): Promise<Task[]> {
    let collection = this.todoCollection()

    let tasks = await collection.find({ user_id: userId }).toArray()

    return tasks.map(task => {
      return {
        id: task._id.toString(),
        name: task.name
      }
    })
  }

  async getTask(userId: string, taskId: string): Promise<Task> {
    let collection = this.todoCollection()

    let res = (await collection.findOne({ _id: new ObjectId(taskId) }))

    if (!res) {
      throw new NoMatchesError('Error getting task!')
    } else if (res.user_id.toString() === userId) {
      return {
        id: res._id.toString(),
        name: res.name
      }
    } else {
      throw new AccessError('Error getting task!')
    }
  }

  async addTask(userId: string, name: string): Promise<string> {
    let collection = this.todoCollection()

    let res = await collection.insertOne({ user_id: userId, name: name })

    return res.insertedId.toString()
  }

  async updateTask(userId: string, taskId: string, updatedName: string): Promise<void> {
    let collection = this.todoCollection()

    let res = await collection.updateOne({ _id: new ObjectId(taskId), user_id: userId }, { $set: { name: updatedName } })

    if (!res) {
      throw new RequestError('Error updating task!')
    } else if (!res.matchedCount) {
      throw new NoMatchesError('Error updating task!')
    }
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    let collection = this.todoCollection()

    var res = await collection.deleteOne({ _id: new ObjectId(taskId), user_id: userId })

    if (!res) {
      throw new RequestError('Error deleting task!')
    } else if (!res.deletedCount) {
      throw new NoMatchesError('Error deleting task!')
    }
  }
}