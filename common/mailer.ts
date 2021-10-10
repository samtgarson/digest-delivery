import { config, SES } from 'aws-sdk'
import * as nodemailer from 'nodemailer'
import { Options } from 'nodemailer/lib/mailer'
import { basename } from 'path'

if (process.env.DD_AWS_ACCESS_KEY_ID && process.env.DD_AWS_SECRET_ACCESS_KEY) {
  config.update({
  'credentials': {
     'accessKeyId': process.env.DD_AWS_ACCESS_KEY_ID,
     'secretAccessKey': process.env.DD_AWS_SECRET_ACCESS_KEY
    }
  })
}

const developmentSmtpUrl = process.env.SMTP_URL
const senderEmail = process.env.MAILER_SENDER

const defaultMailer = () => {
  if (process.env.NODE_ENV === 'production') {
    const sesClient = new SES({
      region: 'eu-west-2'
    })
    return nodemailer.createTransport({ SES: sesClient })
  }

  return nodemailer.createTransport(developmentSmtpUrl)
}

if (!senderEmail) throw new Error('Missing SENDER')

export class Mailer {
	constructor (
		private transport = defaultMailer(),
		private sender = senderEmail,
		private cc: boolean = !!process.env.SEND_CC
	) {}

  async sendSignInEmail (email: string, url: string): Promise<void> {
    this.transport.sendMail({
      to: email,
      from: this.sender,
      subject: 'Sign In to Digest Delivery',
      html: `<a href="${url}">Sign In</a>`
    })
  }

	async sendDigestEmail (path: string, to: string, replyTo: string): Promise<void> {
		const mailOpts = this.digestOptions(path, to, replyTo)

		if (this.cc) mailOpts.cc = this.sender
		this.transport.sendMail(mailOpts)
	}

	digestOptions (path: string, to: string, replyTo: string): Options {
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

