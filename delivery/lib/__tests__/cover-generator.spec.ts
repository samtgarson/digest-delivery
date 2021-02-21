import mockPuppeteer, { Browser, ElementHandle, Page } from 'puppeteer'
import { CoverGenerator } from '../../lib/cover-generator'

jest.mock('puppeteer', () => {
  const body = { screenshot: jest.fn() }
  const page = { setContent: jest.fn(), $: jest.fn(() => body) }
  const browser = { newPage: jest.fn(() => page) }
  return { launch: jest.fn(() => browser) }
})

describe('cover generator', () => {
  const date = '13 Feb 2021'
  const path = '/target/path'
  const output = `${path}/${date} cover.png`
  const template = '<body><p>{{ DATE }}</p></body>'
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
    expect(page.setContent).toHaveBeenCalledWith('<body><p>13 Feb 2021</p></body>', { waitUntil: 'networkidle0' })
  })

  it('screenshots the body', () => {
    expect(page.$).toHaveBeenCalledWith('body')
    expect(body?.screenshot).toHaveBeenCalledWith({ path: output, type: 'png' })
  })
})
