import Mail from 'nodemailer/lib/mailer'
import { Mailer } from '../mailer'

describe('Mailer', () => {
  const mockTransport = { sendMail: jest.fn() } as unknown as jest.Mocked<Mail>
  const sender = 'sender'
  const recipient = 'recipient'
  const replyTo = 'email'
  const path = 'path/filename.png'

  it('sends a mail', () => {
    const mailer = new Mailer(mockTransport, sender, false)

    mailer.sendDigestEmail(path, recipient, replyTo)

    expect(mockTransport.sendMail).toHaveBeenCalledWith({
      attachments: [
        {
          contentType: 'image/png',
          filename: 'filename.png',
          path
        }
      ],
      from: sender,
      replyTo,
      text: expect.any(String),
      subject: 'convert',
      to: recipient
    })
  })

  it('can include CC', () => {
    const mailer = new Mailer(mockTransport, sender, true)

    mailer.sendDigestEmail(path, recipient, replyTo)

    expect(mockTransport.sendMail).toHaveBeenCalledWith({
      attachments: [
        {
          contentType: 'image/png',
          filename: 'filename.png',
          path
        }
      ],
      from: sender,
      replyTo,
      cc: sender,
      text: expect.any(String),
      subject: 'convert',
      to: recipient
    })
  })
})
