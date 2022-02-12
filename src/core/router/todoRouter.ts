import express, { Request, Response } from 'express'
import crypto from 'crypto'
import { users } from '../storage/user'
import { ITodoStorageService } from '../storage/interface'
import { AccessError, NoMatchesError } from '../storage/todoStorage'
import { ITodoRouterService as ITodoRouterService } from './interface'
import { ILoggerService } from '../logger/interfaces'

interface CustomRequest extends Request {
  user?: { id: string, login: string }
}

export class TodoRouterServise implements ITodoRouterService {
  private todoStorageService: ITodoStorageService
  private loggerService: ILoggerService
  private todoApiRouter = express.Router()

  readonly tokenKey = '1a2b-3c4d-5e6f-7g8h'

  constructor(loggerService: ILoggerService, todoStorageService: ITodoStorageService) {
    this.todoStorageService = todoStorageService
    this.loggerService = loggerService

    this.todoApiRouter.use(express.json())
    this.todoApiRouter.use(this.authMiddleware)

    this.todoApiRouter.post('/auth', this.postAuth)
    this.todoApiRouter.get('/task', this.getTasks)
    this.todoApiRouter.get('/task/:id', this.getTask)
    this.todoApiRouter.put('/task/:id', this.updateTask)
    this.todoApiRouter.post('/task', this.addTask)
    this.todoApiRouter.delete('/task/:id', this.deleteTask)
  }

  getRouter(): express.Router {
    return this.todoApiRouter
  }

  private authMiddleware = (req: CustomRequest, res: Response, next: () => void) => {
    // Здесь же можно внедрить функцию определения ролей
    try {
      if (req.headers.authorization) {
        let tokenParts = req.headers.authorization.split(' ')[1].split('.')

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
      this.loggerService.logError(error)
    } finally {
      next()
    }
  }


  private postAuth = (req: CustomRequest, res: Response) => {
    if (!req.body.login || !req.body.password) {
      return res.status(404).send('Not valid request!')
    }

    const user = users.find(user => req.body.login === user.login && req.body.password === user.password)

    if (user) {
      let head = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'jwt' })).toString('base64')

      let body = Buffer.from(JSON.stringify(user)).toString('base64')

      let signature = crypto
        .createHmac('SHA256', this.tokenKey)
        .update(`${head}.${body}`)
        .digest('base64')

      return res.status(200).json({
        id: user.id,
        login: user.login,
        token: `${head}.${body}.${signature}`,
      })
    } else {
      return res.status(404).send('User not found')
    }
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

  private getTask = async (req: CustomRequest, res: Response) => {

    const taskId = req?.params?.id

    if (!taskId) {
      return res.status(400).send('Bad Request')
    }

    if (req.user) {
      try {
        let task = await this.todoStorageService.getTask(req.user.id, taskId)
        return res.status(200).send(task)
      } catch (error) {
        if (error instanceof AccessError) {
          return res.status(403).send('Forbidden')
        } else if (error instanceof NoMatchesError) {
          return res.status(404).send('Not Found')
        } else {
          return res.status(500).send('Internal Server Error')
        }
      }
    } else {
      res.status(401).send('Unauthorized')
    }
  }

  private updateTask = async (req: CustomRequest, res: Response) => {

    const taskId = req?.params?.id
    const updatedName = req.body?.name

    if (!taskId || !updatedName) {
      return res.status(400).send('Bad Request')
    }

    if (req.user) {
      try {
        await this.todoStorageService.updateTask(req.user.id, taskId, updatedName)
        return res.status(202).send('Accepted')
      } catch (error) {
        if (error instanceof NoMatchesError) {
          return res.status(404).send('Not Found')
        } else {
          return res.status(304).send('Not Modified')
        }
      }
    } else {
      res.status(401).send('Unauthorized')
    }
  }

  private addTask = async (req: CustomRequest, res: Response) => {

    const taskName = req.body?.name

    if (!taskName) {
      return res.status(400).send('Bad Request')
    }

    if (req.user) {
      try {
        let taskId = await this.todoStorageService.addTask(req.user.id, taskName)
        return res.status(201).send(taskId)
      } catch (error) {
        return res.status(500).send('Internal Server Error')
      }
    } else {
      res.status(401).send('Unauthorized')
    }
  }

  private deleteTask = async (req: CustomRequest, res: Response) => {

    const taskId = req?.params?.id

    if (!taskId) {
      return res.status(400).send('Bad Request')
    }

    if (req.user) {
      try {
        await this.todoStorageService.deleteTask(req.user.id, taskId)
        return res.status(202).send('Accepted')
      } catch (error) {
        if (error instanceof NoMatchesError) {
          return res.status(404).send('Not Found')
        } else {
          return res.status(400).send('Bad Request')
        }
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


