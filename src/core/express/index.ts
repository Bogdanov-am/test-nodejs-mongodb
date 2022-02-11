import { IExpressService } from "./interface";
import express, { Express, Router } from 'express'

export class ExpressService implements IExpressService {
  app: Express

  constructor() {
    this.app = express()

    // this.app.
  }

  use(path: string, router: Router) {
    this.app.use(path, router)
  }

  async init(): Promise<void> {
    let connectPromise = new Promise<void>((resolve, reject) => {
      this.app.listen(1000, () => {
        resolve()
      })
    })

    await connectPromise
    console.log('Server started!')
  }

  async finally(): Promise<void> {

  }
}