export const createArticleMock = jest.fn()
export const getUnprocessedArticlesMock = jest.fn()
export const destroyProcessedArticlesMock = jest.fn()

export const DataClient = jest.fn(() => ({
	createArticle: createArticleMock,
	getUnprocessedArticles: getUnprocessedArticlesMock,
	destroyProcessedArticles: destroyProcessedArticlesMock
}))
