import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/main/lib/SupabaseAuthClient'
import { ApiKey } from 'src/lib/api-key'
import { Article, User, ApiKeyEntity, ArticleAttributes, DigestEntity, DigestEntityWithMeta, DigestEntityWithArticles, Subscription } from 'types/digest'
import { hydrate } from './util'

const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string

type PaginationOptions = {
	perPage?: number
	page?: number
}

function validKey (target: DataClient, key: string | number | symbol): key is keyof DataClient {
  return key in target
}

export class DataClient {
	private supabase: SupabaseClient

	constructor (
		client?: SupabaseClient
	) {
		this.supabase = client ?? createClient(supabaseUrl, supabaseKey)

		return new Proxy(this, {
			get (target, property) {
				if (!validKey(target, property)) return undefined
				if (!(target[property] instanceof Function) || property === 'auth') return target[property]

				return new Proxy(target[property], {
					async apply (method, thisArg, args) {
						const result = await Reflect.apply(method, thisArg, args)
						return hydrate(result)
					}
				})
			}
		})
	}

	get auth (): SupabaseAuthClient { return this.supabase.auth }

	async createArticle (
		user_id: string,
		attrs: ArticleAttributes
	): Promise<void> {
		const { error } = await this.supabase
			.from('articles')
			.insert({ ...attrs, user_id }, { returning: 'minimal' })

		if (error) throw error
	}

	async getArticles (userId: string, { unprocessed }: { unprocessed?: boolean } = {}): Promise<Article[]> {
		let query = this.supabase
			.from<Article>('articles')
			.select('*')
			.order('created_at')
			.eq('user_id', userId)

		if (unprocessed) query = query.is('digest_id', null)

		const { data, error } = await query

		if (error) throw error

		return data ? data : []
	}

	async createDigest (userId: string, articles: Article[]): Promise<DigestEntity> {
		const { data: digest, error: digestError } = await this.supabase
			.from<DigestEntity>('digests')
			.insert({ user_id: userId })
			.single()

		if (digestError) throw digestError
		if (!digest) throw new Error('Could not create digest')

		const { error } = await this.supabase
			.from<Article>('articles')
			.update({ digest_id: digest.id })
			.in('id', articles.map(a => a.id))

		if (error) throw error

		return digest
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

	async createApiKey (key: ApiKey): Promise<void> {
		const { error, data } = await this.supabase
			.from('api_keys')
			.insert({
				user_id: key.userId,
				key: key.encrypted()
			})
			.single()

		if (error || !data) throw error

		const { error: expireError } = await this.supabase
			.from<ApiKeyEntity>('api_keys')
			.update({ expired_at: new Date() }, { returning: 'minimal' })
			.eq('user_id', key.userId)
			.neq('id', data.id)

		if (expireError) throw expireError
	}

	async validateApiKey (key: string): Promise<string | void> {
		const { data } = await this.supabase
			.from<ApiKeyEntity>('api_keys')
			.select('user_id')
			.eq('key', key)
			.is('expired_at', null)
			.single()

		if (data) return data.user_id
	}

	async getDueUsers (): Promise<User[]> {
		const { data, error } = await this.supabase
			.from<User>('due_users')
			.select('id,kindle_address')

		if (error) throw error

		return data ?? []
	}

	async getDigests (
		userId: string, { perPage = 10, page = 0, includeArticles = false }:
		PaginationOptions & { includeArticles?: boolean }
		= { perPage: 10, page: 0 }
	):
		Promise<{ data: DigestEntityWithMeta[], total: number }>
	{
		const select = includeArticles ? '*, articles(*)' : '*'
		const { data, error, count } = await this.supabase
			.from<DigestEntityWithMeta>('digests_with_meta')
			.select(select, { count: 'estimated' })
			.eq('user_id', userId)
			.order('delivered_at')
			.range(page * perPage, (page + 1) * perPage)

		if (error && error instanceof Error) throw error

		return { data: data || [], total: count || 0 }
	}

	async getDigest (userId: string, digestId: string): Promise<DigestEntityWithArticles | null> {
		const { data, error } = await this.supabase
			.from<DigestEntityWithArticles>('digests')
			.select('*, articles(*)')
			.eq('id', digestId)
			.eq('user_id', userId)
			.single()

		if (error) throw error

		return data
	}

	async createSubscription (user_id: string, hook_url: string): Promise<Subscription | null> {
		const { error, data } = await this.supabase
			.from<Subscription>('subscriptions')
			.insert({ user_id, hook_url })

		if (error) throw error

		return data && data[0]
	}

	async deleteSubscription (userId: string, hookUrl: string): Promise<void> {
		const { error } = await this.supabase
			.from('subscriptions')
			.delete({ returning: 'minimal' })
			.eq('user_id', userId)
			.eq('hook_url', hookUrl)

		if (error) throw error
	}

	async getSubscriptions (userId: string): Promise<Subscription[]> {
		const { error, data } = await this.supabase
			.from<Subscription>('subscriptions')
			.select('*')
			.eq('user_id', userId)

		if (error) throw error

		return data ?? []
	}
}
