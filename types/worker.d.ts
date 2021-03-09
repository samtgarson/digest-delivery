import type { FunctionThread } from 'threads'
import { User } from './digest'

export type Deliver = (user: User, coverPath: string) => Promise<void>
export type DeliveryWorker = FunctionThread<Parameters<Deliver>, void>
