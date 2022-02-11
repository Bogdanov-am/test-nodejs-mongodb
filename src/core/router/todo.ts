import express, { Request, Response } from 'express'
import crypto from 'crypto'
import { users } from '../storage/user'
import { ITodoStorageService } from '../storage/interface'
import { RequestError } from '../storage/todo'
import { ITodoRouterService as ITodoRouterService } from './interface'

export interface CustomRequest extends Request {
  user?: { id: string, login: string }
}

export class TodoRouterServise implements ITodoRouterService {
  private todoStorageService: ITodoStorageService
  private todoApiRouter = express.Router()

  readonly tokenKey = '1a2b-3c4d-5e6f-7g8h'

  constructor(todoStorageService) {
    this.todoStorageService = todoStorageService

    this.todoApiRouter.use(express.json())
    this.todoApiRouter.use(this.authMiddleware)

    this.todoApiRouter.post('/auth', this.postAuth)
    this.todoApiRouter.get('/tasks', this.getTasks)
  }

  getRouter(): express.Router {
    return this.todoApiRouter
  }

  private authMiddleware = (req: CustomRequest, res: Response, next) => {
    try {
      if (req.headers.authorization) {
        let tokenParts = req.headers.authorization
          .split(' ')[1]
          .split('.')

        let signature = crypto
          .createHmac('SHA256', this.tokenKey)
          .update(`${tokenParts[0]}.${tokenParts[1]}`)
          .digest('base64')

        if (signature === tokenParts[2]) {
          req.user = JSON.parse(
            Buffer.from(tokenParts[1], 'base64').toString('utf8')
          )
        }
      }
    } catch (error) {

    } finally {
      next()
    }
  }


  private postAuth = (req: CustomRequest, res: Response) => {
    if (req.body.login && req.body.password) {
      for (let user of users) {
        if (
          req.body.login === user.login &&
          req.body.password === user.password
        ) {
          let head = Buffer.from(
            JSON.stringify({ alg: 'HS256', typ: 'jwt' })
          ).toString('base64')
          let body = Buffer.from(JSON.stringify(user)).toString(
            'base64'
          )
          let signature = crypto
            .createHmac('SHA256', this.tokenKey)
            .update(`${head}.${body}`)
            .digest('base64')

          return res.status(200).json({
            id: user.id,
            login: user.login,
            token: `${head}.${body}.${signature}`,
          })
        }
      }
    } else {
      return res.status(404).json({ message: 'Not valid request!' })
    }

    return res.status(404).json({ message: 'User not found' })
  }

  private getTasks = async (req: CustomRequest, res: Response) => {
    if (req.user) {
      try {
        let tasks = await this.todoStorageService.getTasks(req.user.id)
        return res.status(200).send(tasks)
      } catch (error) {
        return res.status(500).send('Internal Server Error')
      }
    } else {
      res.status(401).send('Unauthorized')
    }
  }

  async init(): Promise<void> {
  }

  async finally(): Promise<void> {
  }
}


