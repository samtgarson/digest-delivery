export const sendEmailMock = jest.fn()

export const Mailer = jest.fn(() => ({
	sendEmail: sendEmailMock
}))
