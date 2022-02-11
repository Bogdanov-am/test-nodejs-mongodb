import { IService } from '../common/interfaces'

export interface IConfigurationService extends IService {
  getConfiguration(name: string): any
}
