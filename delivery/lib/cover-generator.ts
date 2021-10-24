import puppeteer from 'puppeteer'
import * as blobs from 'blobs/v2'
import { dateString, humaniseDate } from '@digest-delivery/common/util'

const defaultTemplate = `
<html>
<body>
  <style>
    @font-face {
      font-family: custom;
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url(https://digest.delivery/fonts/font-book.woff) format("woff")
    }

    body {
      width: 1600px;
      height: 2560px;
      background-color: white;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      color: #2714FF;
    }

    h1,
    p {
      margin: 60 100;
      font-family: custom, sans-serif;
      z-index: 2;
    }

    h1 {
      font-size: 250;
      line-height: 1.2;
    }

    p {
      font-size: 160;
    }

    svg {
      z-index: 0;
      height: 60vh;
      width: 60vh;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate3d(-30vh, -30vh, 0) scaleX(0.9);
    }
  </style>
  <h1>Digest, delivered.</h1>
  <p>{{ DATE }}</p>
  {{ SVG }}

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

  async generate (date: Date): Promise<string> {
    const filename = dateString(date)
    const path = `${this.outputDir}/cover-${filename}.png`

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
      ignoreHTTPSErrors: true,
      executablePath: this.chromePath
    })

    const html = this.html(date)
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const body = await page.$('body')

    if (!body) throw new Error('Could not find body element')

    await body.screenshot({ type: 'png', path })

    return path
  }

  private html (date: Date) {
    return this.template
      .replace('{{ DATE }}', humaniseDate(date))
      .replace('{{ SVG }}', this.generateBlob())
  }

  private generateBlob () {
    return blobs.svg(
      {
        seed: Math.random(),
        extraPoints: 2,
        randomness: 8,
        size: 500
      },
      {
        fill: '#73F9BD'
      }
    )
  }
}
