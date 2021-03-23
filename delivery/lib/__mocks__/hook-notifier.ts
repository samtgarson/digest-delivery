export const notifyMock = jest.fn()

export const HookNotifier = jest.fn(() => ({
	notify: notifyMock
}))
