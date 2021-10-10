import { Prisma, PrismaClient } from '@prisma/client'
import { ApiKey } from 'src/lib/api-key'
import { Article, ArticleAttributes, DigestEntity, DigestEntityWithArticles, DigestEntityWithMeta, RawUser, Subscription, User } from 'types/digest'

type PaginationOptions = {
	perPage?: number
	page?: number
}

// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}
const createDefaultClient = () => {
  if (global.prisma) return global.prisma
  const client = new PrismaClient()
  if (process.env.NODE_ENV === 'development') global.prisma = client
  return client
}

type Attrs<T> = Omit<T, 'id' | 'createdAt'>

export class DataClient {
	private client: PrismaClient

	constructor (client?: PrismaClient) {
		this.client = client || createDefaultClient()
	}

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

	async updateUser (id: string, data: Partial<Attrs<User>>): Promise<User> {
    return this.client.user.update({ where: { id }, data })
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

	async validateApiKey (key: string): Promise<User | void> {
    const { user } = await this.client.apiKey.findFirst({
      where: { key, expiredAt: null },
      include: { user: true }
    }) || {}

    return user
	}

	async getDueUsers (): Promise<User[]> {
    const raw = await this.client.$queryRaw<RawUser[]>`select * from get_due_users();`

    return raw.map(({ kindle_address, ...u }) => ({ ...u, kindleAddress: kindle_address }))
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
      this.client.digest.findMany({
        skip: page * perPage,
        take: perPage,
        where: { userId },
        orderBy: { deliveredAt: 'desc' },
        include: {
          articles: includeArticles,
          _count: {
            select: { articles: true }
          }
        }
      }),
      this.client.digest.count({
        where: { userId }
      })
    ])

    return { data, total }
	}

	async getDigest (userId: string, digestId: string): Promise<DigestEntityWithArticles | null> {
    return this.client.digest.findFirst({
      include: {
        articles: true,
        _count: { select: { articles: true } }
      },
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
