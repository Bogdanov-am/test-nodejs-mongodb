import { RawData } from '../core/common/interfaces'

export function isBuffer(u: RawData): u is Buffer {
  return Buffer.isBuffer(u)
}

export function isString(u: unknown): u is string {
  return typeof u === 'string' || u instanceof String
}