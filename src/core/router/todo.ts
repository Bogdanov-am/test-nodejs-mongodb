import express, { Request, Response } from 'express'
import crypto from 'crypto'
import { users } from '../storage/user'

export const todoApiRouter = express.Router()
todoApiRouter.use(express.json())

const tokenKey = '1a2b-3c4d-5e6f-7g8h'

export interface CustomRequest extends Request {
  user?: string
}

todoApiRouter.use((req: CustomRequest, res: Response, next) => {
  try {
    if (req.headers.authorization) {
      let tokenParts = req.headers.authorization
        .split(' ')[1]
        .split('.')
  
      let signature = crypto
        .createHmac('SHA256', tokenKey)
        .update(`${tokenParts[0]}.${tokenParts[1]}`)
        .digest('base64')
  
      if (signature === tokenParts[2]) {
        req.user = JSON.parse(
          Buffer.from(tokenParts[1], 'base64').toString('utf8')
        )
      }
  
      next()
    }
  
    next()
  } catch (error) {
    console.log('Ошибка')
    next()
  }
  
})

todoApiRouter.post('/auth', (req: CustomRequest, res: Response) => {
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
          .createHmac('SHA256', tokenKey)
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
})

todoApiRouter.get('/task', async (req: CustomRequest, res: Response) => {
  if (req.user) {
    console.log(req.user)
  } else {
    console.log('Пошел ты!')
  }
    
  res.status(200).send('Hello')
})
