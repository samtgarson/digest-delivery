export const compileMock = jest.fn()

export const ArticleCompiler = jest.fn(() => ({
	compile: compileMock
}))
