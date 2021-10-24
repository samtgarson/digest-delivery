import { DataClient } from '@digest-delivery/common/data-client'
import { Mailer } from '@digest-delivery/common/mailer'
import { ArticleCompiler } from 'delivery/lib/article-compiler'
import { HookNotifier } from 'delivery/lib/hook-notifier'
import type { FunctionThread } from 'threads'
import { User } from './digest'

export type DeliveryDependencies = {
  mailer: Mailer
  articleCompiler: ArticleCompiler
  dataClient: DataClient
  hookNotifier: HookNotifier
}
export type Deliver = (user: User, coverPath: string, dependencies?: DeliveryDependencies) => Promise<void>
export type DeliveryWorker = FunctionThread<Parameters<Deliver>, void>
