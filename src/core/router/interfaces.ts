import { DataFrame, RawData } from '../common/interfaces';

enum SpeedType {
  Fast,
  Slow
}

enum LatencyType {
  Low,
  High,
}

interface IRoute {
  readonly uuid: string
  readonly uuidChannel: string
  readonly speedType: SpeedType
  readonly latencyType: LatencyType
} 

interface IRouterService {
  newData(frame: DataFrame): void
  write(route: IRoute, data: RawData): Promise<void>
  pushDataFromChannel(): void
}