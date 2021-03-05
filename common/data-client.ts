import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/main/lib/SupabaseAuthClient'
import { Article, User } from 'types/digest'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string

export class DataClient {
	private supabase: SupabaseClient

	constructor (
		client?: SupabaseClient
	) {
		this.supabase = client ?? createClient(supabaseUrl, supabaseKey)
	}

	get auth (): SupabaseAuthClient { return this.supabase.auth }

	async createArticle (title: string, content: string, author?: string): Promise<void> {
		const { error } = await this.supabase
			.from('articles')
			.insert([
				{ title, content, author }
			], { returning: 'minimal' })

		if (error) throw error
	}

	async getUnprocessedArticles (): Promise<Article[]> {
		const { data, error } = await this.supabase
			.from<Article>('articles')
			.select('*')

		if (error) throw error

		return data ?? []
	}

	async destroyProcessedArticles (articles: Article[]): Promise<void> {
		const { error } = await this.supabase
			.from('articles')
			.delete({ returning: "minimal" })
			.in('id', articles.map(a => a.id))

		if (error) throw error
	}

	async getUser (id: string): Promise<User | null> {
		const { data, error } = await this.supabase
			.from<User>('users')
			.select('*')
			.eq('id', id)
			.single()

		if (error) throw error

		return data
	}

	async updateUser (id: string, payload: Partial<Omit<User, 'id'>>): Promise<void> {
		const { error } = await this.supabase
			.from<User>('users')
			.update(payload, { returning: 'minimal' })
			.eq('id', id)
			.single()

		if (error) throw error
	}
}
