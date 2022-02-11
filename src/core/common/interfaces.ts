export interface IService {
  init(): Promise<void>
  finally(): Promise<void>
} 
