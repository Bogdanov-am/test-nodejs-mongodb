import { IExpressService } from './interface'
import express, { Express, Router } from 'express'
import { IConfigurationService } from '../configuration/interfaces'
import { ILoggerService } from '../logger/interfaces'
import { Server } from 'http'

export class ExpressService implements IExpressService {
  private app: Express
  private server: Server | undefined
  private configurationService: IConfigurationService
  private loggerService: ILoggerService

  constructor(loggerService: ILoggerService, configurationService: IConfigurationService) {
    this.app = express()

    this.configurationService = configurationService
    this.loggerService = loggerService
  }

  use(path: string, router: Router) {
    this.app.use(path, router)
  }

  async init(): Promise<void> {
    const port = this.configurationService.getConfiguration('Express').port

    this.loggerService.logInfo('Http server starting...')
    let connectPromise = new Promise<void>((resolve, reject) => {
      this.server = this.app.listen(port, () => {
        resolve()
      })
    })

    await connectPromise
    this.loggerService.logInfo('Http server successfully started!')
  }

  async finally(): Promise<void> {
    this.server?.close()
    this.loggerService.logInfo('Http server closed.')
  }
}