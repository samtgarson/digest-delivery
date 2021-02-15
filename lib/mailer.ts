import { SES } from 'aws-sdk'
import nodemailer from 'nodemailer'
import { basename } from 'path'

const sesClient = new SES({
	region: 'eu-west-2'
})

const defaultMailer = nodemailer.createTransport({ SES: sesClient })
const recipientEmail = process.env.MAILER_RECIPIENT
const senderEmail = process.env.MAILER_SENDER

if (!recipientEmail) throw new Error('Missing RECIPIENT')
if (!senderEmail) throw new Error('Missing SENDER')

export class Mailer {
	constructor (
		private transport = defaultMailer,
		private sender = senderEmail,
		private recipient = recipientEmail
	) {}

	async sendEmail (path: string): Promise<void> {
		return this.transport.sendMail({
			to: this.recipient,
			cc: this.sender,
			from: this.sender,
			subject: 'convert',
			text: "This is an automated message",
			attachments: [
				{ path, filename: basename(path), contentType: 'image/png' }
			]
		})
	}
}

