import { TestServer } from './core/app/app'
import { ObjectId } from 'mongodb'

const app = new TestServer()
app.init()


process.on('SIGINT', () => app.finally())