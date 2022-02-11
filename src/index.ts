import { TestServer } from './core/app/app'
import { ObjectId } from 'mongodb'

const app = new TestServer()
app.init().then(async () => {
  // let id = await app.todoStorageService.addTask('sffs', 'Hello world!')
  // console.log(JSON.stringify(id))

  // let tasks = await app.todoStorageService.getTasks('sffs')
  // console.log(JSON.stringify(tasks))

  // let task = await app.todoStorageService.getTask('sffs', '6206bdc34ffa1bfe88da0891')
  // console.log(JSON.stringify(task))

})
