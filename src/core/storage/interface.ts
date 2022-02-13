import { IService } from '../common/interfaces'
import type { ObjectId } from 'mongodb'

export interface Task {
  id: string
  name: string
}

export interface ITodoStorageService extends IService {
  getTasks(userId: string): Promise<Task[]>
  getTask(userId: string, taskId: string): Promise<Task>
  addTask(userId: string, name: string): Promise<string>
  updateTask(userId: string, taskId: string, name: string): Promise<void>
  deleteTask(userId: string, taskId: string): Promise<void>
}