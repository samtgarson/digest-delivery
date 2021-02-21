import { SES } from 'aws-sdk'
import * as nodemailer from 'nodemailer'
import { Options } from 'nodemailer/lib/mailer'
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
		private recipient = recipientEmail,
		private cc: boolean = !!process.env.SEND_CC
	) {}

	async sendEmail (path: string): Promise<void> {
		const mailOpts = this.options(path)

		if (this.cc) mailOpts.cc = this.sender
		return this.transport.sendMail(mailOpts)
	}

	options (path: string): Options {
		return {
			to: this.recipient,
			from: this.sender,
			subject: 'convert',
			text: "This is an automated message",
			attachments: [
				{ path, filename: basename(path), contentType: 'image/png' }
			]
		}
	}
}

