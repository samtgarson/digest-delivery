import Mail from 'nodemailer/lib/mailer'
import { Mailer } from '../../lib/mailer'

describe('Mailer', () => {
  const mockTransport = { sendMail: jest.fn() } as unknown as jest.Mocked<Mail>
  const sender = "sender"
  const recipient = "recipient"
  const path = 'path/filename.png'

  it('instantiates with default dependencies', () => {
    const mailer = new Mailer()

    expect(mailer['transport']).toBeInstanceOf(Mail)
    expect(mailer['sender']).toEqual(process.env.MAILER_SENDER)
    expect(mailer['recipient']).toEqual(process.env.MAILER_RECIPIENT)
  })

  it('sends a mail', () => {
    const mailer = new Mailer(mockTransport, sender, recipient)

    mailer.sendEmail(path)

    expect(mockTransport.sendMail).toHaveBeenCalledWith({
      attachments: [
        {
          contentType: "image/png",
          filename: 'filename.png',
          path
        }
      ],
      from: sender,
      text: expect.any(String),
      subject: "convert",
      to: recipient
    })
  })

  it('can include CC', () => {
    const mailer = new Mailer(mockTransport, sender, recipient, true)

    mailer.sendEmail(path)

    expect(mockTransport.sendMail).toHaveBeenCalledWith({
      attachments: [
        {
          contentType: "image/png",
          filename: 'filename.png',
          path
        }
      ],
      from: sender,
      cc: sender,
      text: expect.any(String),
      subject: "convert",
      to: recipient
    })
  })
})

