import Chromium from 'chrome-aws-lambda'
import { PuppeteerNode } from 'puppeteer-core'

const defaultTemplate = `
<html>
<body>
  <style>
    @font-face {
      font-family: Circular;
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://old.samgarson.com/fonts/CircularStd-Book.09b23336.woff) format("woff")
    }

    body {
      width: 1600px;
      height: 2560px;
      background-color: black;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      color: white;
    }

    h1,
    p {
      margin: 60 100;
      font-family: Circular, sans-serif;
    }

    h1 {
      font-size: 250;
      line-height: 1;
    }

    p {
      font-size: 160;
    }
  </style>
  <h1>Sam&rsquo;s daily digest.</h1>
  <p>{{ DATE }}</p>

</body>
</html>
`
const defaultOutputDir = process.env.OUTPUT_DIR

interface IChromium {
  puppeteer: PuppeteerNode
}

export class CoverGenerator {
	constructor (
    private chromium: IChromium = Chromium,
		private outputDir = defaultOutputDir,
    private template = defaultTemplate,
    private fallbackChromiumPath = process.env.CHROMIUM_PATH
  ) {}

  async generate (date: string): Promise<string> {
    const path = `${this.outputDir}/${date} cover.png`
    const awsChromiumPath = await Chromium.executablePath

    const browser = await this.chromium.puppeteer.launch({
      args: Chromium.args,
      defaultViewport: Chromium.defaultViewport,
      executablePath: awsChromiumPath || this.fallbackChromiumPath,
      headless: true,
      ignoreHTTPSErrors: true
    })

    const html = this.template.replace('{{ DATE }}', date)
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const body = await page.$('body')

    if (!body) throw new Error('Could not find body element')

    await body.screenshot({ type: 'png', path })

    return path
  }
}
