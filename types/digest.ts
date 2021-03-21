import { NextApiRequest, NextApiResponse } from "next"

export type AuthedHandler<T = unknown> = (req: NextApiRequest, res: NextApiResponse<T>, user: User) => void | Promise<void>

export interface Compilable {
	html: string
	title: string
}

export enum Frequency {
	Daily = 'DAILY',
	Weekly = 'WEEKLY'
}

export type ArticleAttributes = {
	title: string
	content: string
	author?: string
	source?: string
	original_url?: string
}

export type Article = ArticleAttributes & {
	id: string
	created_at: string
	digest_id?: string
	user_id: string
}

export type User = {
	id: string
	active: boolean
	kindle_address: string | null
	frequency: Frequency
}

export type ApiKeyEntity = {
	id: string
	key: string
	user_id: string
	expired_at?: string
}

export type DigestEntity = {
	id: string
	delivered_at: string
	user_id: string
}

export type DigestEntityWithMeta = DigestEntity & {
	articles_count: number
}

export type DigestEntityWithArticles = DigestEntity & {
	articles: Article[]
}

export type Subscription = {
	id: string
	hook_url: string
	user_id: string
}
