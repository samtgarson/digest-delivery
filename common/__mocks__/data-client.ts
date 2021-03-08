export const createArticleMock = jest.fn()
export const getUnprocessedArticlesMock = jest.fn()
export const createDigestMock = jest.fn()
export const getDueUsersMock = jest.fn()

export const DataClient = jest.fn(() => ({
	createArticle: createArticleMock,
	getUnprocessedArticles: getUnprocessedArticlesMock,
	createDigest: createDigestMock,
	getDueUsers: getDueUsersMock
}))
