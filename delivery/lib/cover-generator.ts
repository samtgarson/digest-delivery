import puppeteer from 'puppeteer'

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
  <h1>Digest delivered.</h1>
  <p>{{ DATE }}</p>

</body>
</html>
`
const defaultOutputDir = process.env.OUTPUT_DIR

export class CoverGenerator {
	constructor (
		private outputDir = defaultOutputDir,
    private template = defaultTemplate,
    private chromePath = process.env.CHROME_PATH
  ) {}

  async generate (date: string): Promise<string> {
    const path = `${this.outputDir}/${date} cover.png`

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
      ignoreHTTPSErrors: true,
      executablePath: this.chromePath
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
