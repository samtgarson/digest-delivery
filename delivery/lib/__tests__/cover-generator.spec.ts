import mockPuppeteer, { Browser, ElementHandle, Page } from 'puppeteer'
import { mocked } from 'ts-jest/utils'
import { CoverGenerator } from '../../lib/cover-generator'
import { svg } from 'blobs/v2'

jest.mock('puppeteer', () => {
  const body = { screenshot: jest.fn() }
  const page = { setContent: jest.fn(), $: jest.fn(() => body) }
  const browser = { newPage: jest.fn(() => page) }
  return { launch: jest.fn(() => browser) }
})

jest.mock('blobs/v2', () => ({
  svg: jest.fn(() => '<svg blob />')
}))

jest.mock('@digest-delivery/common/util', () => ({
  humaniseDate: jest.fn(() => 'human date'),
  dateString: jest.fn(() => 'date string')
}))

describe('cover generator', () => {
  const date = new Date()
  const path = '/target/path'
  const output = `${path}/cover-date string.png`
  const template = '<body><p>{{ DATE }}</p>{{ SVG }}</body>'
  let browser: Browser
  let page: Page
  let body: ElementHandle | null

  const generator = new CoverGenerator(path, template)
  let result: string

  beforeEach(async () => {
    browser = await mockPuppeteer.launch()
    page = await browser.newPage()
    body = await page.$('foo')

    jest.clearAllMocks()
    result = await generator.generate(date)
  })

  it('creates a blob', () => {
    expect(mocked(svg)).toHaveBeenCalledWith(
      {
        extraPoints: 2,
        randomness: 8,
        seed: expect.any(Number),
        size: 500
      },
      {
        fill: '#73F9BD'
      }
    )
  })

  it('returns the path', async () => {
    expect(result).toEqual(output)
  })

  it('launches the browser', async () => {
    expect(mockPuppeteer.launch).toHaveBeenCalledWith({
      headless: true,
      ignoreHTTPSErrors: true,
      args: ['--no-sandbox']
    })
  })

  it('creates a page', () => {
    expect(browser.newPage).toHaveBeenCalled()
    expect(page.setContent).toHaveBeenCalledWith(
      '<body><p>human date</p><svg blob /></body>',
      {
        waitUntil: 'networkidle0'
      }
    )
  })

  it('screenshots the body', () => {
    expect(page.$).toHaveBeenCalledWith('body')
    expect(body?.screenshot).toHaveBeenCalledWith({ path: output, type: 'png' })
  })

  describe('when for some reason body is not found', () => {
    beforeEach(() => {
      jest.clearAllMocks()
      mocked(page.$).mockResolvedValue(null)
    })

    it('throws an error', async () => {
      return expect(() => generator.generate(date)).rejects.toEqual(
        expect.any(Error)
      )
    })
  })
})
