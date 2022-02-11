import { IService } from '../common/interfaces'
import type { Router } from 'express'

export interface ITodoRouterService extends IService {
  getRouter(): Router
}