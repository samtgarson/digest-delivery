import { createHash } from 'crypto'
import uuidApiKey from 'uuid-apikey'

export class ApiKey {
  static encrypt (key: string): string {
    return createHash('sha256').update(key).digest('hex')
  }

  constructor (
    public userId: string,
    public key: string = uuidApiKey.create().apiKey
  ) {}

  encrypted (): string {
    return ApiKey.encrypt(this.key)
  }
}
