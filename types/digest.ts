import { Article, DigestWithMeta, User } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

export type { Article, Digest as DigestEntity, DigestWithMeta as DigestEntityWithMeta, Subscription, User } from '@prisma/client'

export type AuthedHandler<T = unknown> = (req: NextApiRequest, res: NextApiResponse<T>, user: User) => void | Promise<void>

export interface Compilable {
	html: string
	title: string
}

export enum Frequency {
	Daily = 'DAILY',
	Weekly = 'WEEKLY'
}

export type ArticleAttributes = Pick<Article,
  'title' |
  'content' |
  'author' |
  'source' |
  'originalUrl'
>


export type ApiKeyEntity = {
	id: string
	key: string
	user_id: string
	expired_at?: Date
}

export type DigestEntityWithArticles = DigestWithMeta & { articles: Article[] }
