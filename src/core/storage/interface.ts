import { IService } from '../common/interfaces'

export interface Task {
  _id?: string
  name: string
  user_id: string
}

export interface ITodoStorageService extends IService {
  getTasks(userId: string): Task[] 
  getTask(userId: string, taskId: string): Task
  addTask(userId: string, name: string): Task
  updateTask(user_id: string, taskId: string, name: string): Task
  deleteTask(userId: string, taskId: string): void 
}