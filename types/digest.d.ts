export interface Compilable {
	html: string
	title: string
}

export type Article = {
	id: string
	title: string
	content: string
	author?: string
	created_at: Date
}


