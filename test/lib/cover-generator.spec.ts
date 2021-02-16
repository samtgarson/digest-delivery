import { PuppeteerNode } from 'puppeteer-core'
import { CoverGenerator } from '../../lib/cover-generator'
import Chromium from 'chrome-aws-lambda'

describe('cover generator', () => {
  const date = '13 Feb 2021'
  const path = '/target/path'
  const output = `${path}/${date} cover.png`
  const template = '<body><p>{{ DATE }}</p></body>'
  const chromiumPath = 'chromium path'

  const body = { screenshot: jest.fn() }
  const page = { setContent: jest.fn(), $: jest.fn(() => body) }
  const browser = { newPage: jest.fn(() => page) }
  const chromium = { puppeteer: { launch: jest.fn(() => browser) } as unknown as PuppeteerNode }

  const generator = new CoverGenerator(chromium, path, template, chromiumPath)
  let result: string

  beforeEach(async () => {
    result = await generator.generate(date)
  })

  it('returns the path', async () => {
    expect(result).toEqual(output)
  })

  it('launches the browser', async () => {
    expect(chromium.puppeteer.launch).toHaveBeenCalledWith({
      args: Chromium.args,
      defaultViewport: Chromium.defaultViewport,
      executablePath: chromiumPath,
      headless: true,
      ignoreHTTPSErrors: true
    })
  })

  it('creates a page', () => {
    expect(browser.newPage).toHaveBeenCalled()
    expect(page.setContent).toHaveBeenCalledWith('<body><p>13 Feb 2021</p></body>', { waitUntil: 'networkidle0' })
  })

  it('screenshots the body', () => {
    expect(page.$).toHaveBeenCalledWith('body')
    expect(body.screenshot).toHaveBeenCalledWith({ path: output, type: 'png' })
  })
})
