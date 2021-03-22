import { SES } from 'aws-sdk'
import * as nodemailer from 'nodemailer'
import { Options } from 'nodemailer/lib/mailer'
import { basename } from 'path'

const sesClient = new SES({
	region: 'eu-west-2'
})

const defaultMailer = nodemailer.createTransport({ SES: sesClient })
const senderEmail = process.env.MAILER_SENDER

if (!senderEmail) throw new Error('Missing SENDER')

export class Mailer {
	constructor (
		private transport = defaultMailer,
		private sender = senderEmail,
		private cc: boolean = !!process.env.SEND_CC
	) {}

	async sendEmail (path: string, to: string, replyTo: string): Promise<void> {
		const mailOpts = this.options(path, to, replyTo)

		if (this.cc) mailOpts.cc = this.sender
		return this.transport.sendMail(mailOpts)
	}

	options (path: string, to: string, replyTo: string): Options {
		return {
			to,
			replyTo: replyTo,
			from: this.sender,
			subject: 'convert',
			text: "This is an automated message",
			attachments: [
				{ path, filename: basename(path), contentType: 'image/png' }
			]
		}
	}
}

