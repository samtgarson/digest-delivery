export const generateMock = jest.fn()

export const CoverGenerator = jest.fn(() => ({
	generate: generateMock
}))
