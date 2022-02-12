import { TestServer } from './core/app/app'

const app = new TestServer()
app.init()

process.on('SIGINT', () => app.finally())
process.on('SIGTERM', () => app.finally())
