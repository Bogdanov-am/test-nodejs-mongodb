import { IConfigurationService } from './interfaces'

export class ConfigurationService implements IConfigurationService {
  private configuration: any = {}

  constructor() {

  }

  //TODO: Заглушка, чтение данных из файла либо из переменных среды 
  async init() {
    this.configuration = {
      MongoDB: {
        uri: 'mongodb+srv://bogdanov-am:CPQ1pHzOwGJv7jh1@bogdanovcluster.kfhll.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
      },
      Express: {
        port: 10000,
      },
      TodoCollection: {
        databaseName: 'dev-todo',
      }
    }
  } 

  async finally() {

  }

  getConfiguration(name: string): any {
    return this.configuration[name]
  }
  
}