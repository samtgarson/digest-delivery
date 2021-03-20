export const createArticleMock = jest.fn()
export const getArticlesMock = jest.fn()
export const createDigestMock = jest.fn()
export const getDueUsersMock = jest.fn()

export const DataClient = jest.fn(() => ({
	createArticle: createArticleMock,
	getArticles: getArticlesMock,
	createDigest: createDigestMock,
	getDueUsers: getDueUsersMock
}))
