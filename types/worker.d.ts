import type { FunctionThread } from 'threads'
export type Deliver = (userId: string, coverPath: string) => Promise<void>
export type DeliveryWorker = FunctionThread<Parameters<Deliver>, void>
