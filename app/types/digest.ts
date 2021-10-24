import { Article, Digest, User } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

export type { Article, Digest as DigestEntity, Subscription, User } from '@prisma/client'

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

export type DigestEntityWithMeta = Digest & { _count: { articles: number } | null }
export type DigestEntityWithArticles = DigestEntityWithMeta & { articles: Article[] }

export type RawUser = Omit<User, 'kindleAddress'> & { kindle_address: string }
