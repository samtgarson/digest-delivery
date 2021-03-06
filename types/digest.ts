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

export type Article = {
	id: string
	created_at: Date
	processed_at?: Date
	user_id: string
} & ArticleAttributes

export type User = {
	id: string
	active: boolean
	kindle_address: string | null
	frequency: Frequency
}

export type ApiKeyModel = {
	id: string
	key: string
	user_id: string
	expired_at?: Date
}
