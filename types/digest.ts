export interface Compilable {
	html: string
	title: string
}

export enum Frequency {
	Daily = 'DAILY',
	Weekly = 'WEEKLY'
}

export type Article = {
	id: string
	title: string
	content: string
	author?: string
	created_at: Date
}

export type User = {
	id: string
	active: boolean
	kindle_address: string | null
	frequency: Frequency
}
