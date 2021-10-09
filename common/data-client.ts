import { Prisma, PrismaClient } from '@prisma/client'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/main/lib/SupabaseAuthClient'
import { ApiKey } from 'src/lib/api-key'
import { Article, ArticleAttributes, DigestEntity, DigestEntityWithArticles, DigestEntityWithMeta, Subscription, User } from 'types/digest'
const supabaseUrl = process.env.SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_KEY as string

type PaginationOptions = {
	perPage?: number
	page?: number
}

// function validKey (target: DataClient, key: string | number | symbol): key is keyof DataClient {
//   return key in target
// }

type Attrs<T> = Omit<T, 'id' | 'createdAt'>

export class DataClient {
	private client: PrismaClient
	private supabase: SupabaseClient

	constructor (client = new PrismaClient(), supabase = createClient(supabaseUrl, supabaseKey)) {
		this.client = client
		this.supabase = supabase

		// return new Proxy(this, {
		// 	get (target, property) {
		// 		if (!validKey(target, property)) return undefined
		// 		if (!(target[property] instanceof Function) || property === 'auth') return target[property]

		// 		return new Proxy(target[property], {
		// 			async apply (method, thisArg, args) {
		// 				const result = await Reflect.apply(method, thisArg, args)
		// 				return hydrate(result)
		// 			}
		// 		})
		// 	}
		// })
	}

	get auth (): SupabaseAuthClient { return this.supabase.auth }
	async createArticle (
		userId: string,
		attrs: ArticleAttributes
	) {
    await this.client.article.create({ data: { ...attrs, userId } })
	}

	async getArticles (userId: string, { unprocessed }: { unprocessed?: boolean } = {}) {
    const where: Prisma.ArticleWhereInput = { userId: { equals: userId } }
    if (unprocessed) where.digestId = { equals: null }
    return this.client.article.findMany({
      orderBy: { createdAt: 'desc' },
      where: where
    })
	}

	async createDigest (userId: string, articles: Article[]): Promise<DigestEntity> {
    return this.client.digest.create({
      data: { userId, articles: { connect: articles } }
    })
	}

	async getUser (id: string): Promise<User | null> {
    return this.client.user.findUnique({ where: { id } })
	}

	async updateUser (id: string, data: Partial<Attrs<User>>): Promise<void> {
    await this.client.user.update({ where: { id }, data })
	}

	async createApiKey (key: ApiKey): Promise<void> {
    const newKey = key.encrypted()
    await this.client.$transaction([
      this.client.apiKey.create({
        data: {
          userId: key.userId,
          key: newKey
        }
      }),
      this.client.apiKey.updateMany({
        where: { userId: { equals: key.userId }, key: { not: newKey } },
        data: { expiredAt: new Date() }
      })
    ])
	}

	async validateApiKey (key: string): Promise<string | void> {
    const { userId } = await this.client.apiKey.findFirst({ where: { key, expiredAt: null }, select: { userId: true } }) || {}

    return userId
	}

	async getDueUsers (): Promise<User[]> {
    return this.client.dueUser.findMany()
	}

  async getDigests (userId: string, opts: PaginationOptions & { includeArticles: true }): Promise<{ data: Array<DigestEntityWithArticles>, total: number }>
  async getDigests (userId: string, opts: PaginationOptions & { includeArticles?: false }): Promise<{ data: Array<DigestEntityWithMeta>, total: number }>
	async getDigests (
		userId: string, { perPage = 10, page = 0, includeArticles }:
		PaginationOptions & { includeArticles?: boolean }
		= { perPage: 10, page: 0 }
	):
		Promise<{ data: Array<DigestEntityWithMeta>, total: number }>
	{
    const [data, total] = await this.client.$transaction([
      this.client.digestWithMeta.findMany({
        skip: page * perPage,
        take: perPage,
        where: { userId },
        orderBy: { deliveredAt: 'desc' },
        include: { articles: includeArticles }
      }),
      this.client.digestWithMeta.count({
        where: { userId }
      })
    ])

    return { data, total }
	}

	async getDigest (userId: string, digestId: string): Promise<DigestEntityWithArticles | null> {
    return this.client.digestWithMeta.findFirst({
      include: { articles: true },
      where: { id: digestId, userId }
    })
	}

	async createSubscription (userId: string, hookUrl: string): Promise<Subscription | null> {
    return this.client.subscription.create({ data: { userId, hookUrl } })
	}

	async deleteSubscription (userId: string, hookUrl: string): Promise<void> {
    await this.client.subscription.deleteMany({
      where: { userId, hookUrl }
    })
	}

	async getSubscriptions (userId: string): Promise<Subscription[]> {
    return this.client.subscription.findMany({ where: { userId } })
	}
}
