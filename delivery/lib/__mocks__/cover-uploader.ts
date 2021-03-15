export const uploadMock = jest.fn()

export const CoverUploader = jest.fn(() => ({
	upload: uploadMock
}))
