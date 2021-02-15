import { CoverGenerator } from '../../lib/cover-generator'
import htmlToImage from 'node-html-to-image'

jest.mock('node-html-to-image')

describe('cover generator', () => {
  const date = '13 Feb 2021'
  const output = `kindle_output_dir/${date} cover.png`
  const generator = new CoverGenerator()

  it('returns the path', async () => {
    const path = await generator.generate(date)
    expect(path).toEqual(output)
  })

  it('calls the renderer', async () => {
    await generator.generate(date)
    expect(htmlToImage).toHaveBeenCalledWith({
      output,
      content: { date },
      html: expect.any(String)
    })
  })
})
