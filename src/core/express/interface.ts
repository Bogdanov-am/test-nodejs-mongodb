import { IService } from '../common/interfaces'
import { Router } from 'express'

export interface IExpressService extends IService {
  use(path: string, router: Router): void
}