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
	created_at: Date
	digest_id?: Date
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
	expired_at?: Date
}

export type DigestEntity = {
	id: string
	delivered_at: Date
	user_id: string
}
