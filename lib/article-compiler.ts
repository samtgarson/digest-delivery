import { mkdirSync } from 'fs'
import convert from 'ebook-convert'
import { CoverGenerator } from './cover-generator'
import { Digest } from './digest'

const defaultOutputDir = process.env.OUTPUT_DIR as string
const defaultMkrDir = (path: string) => mkdirSync(path, { recursive: true })

const coverGenerator = new CoverGenerator()

if (!defaultOutputDir) throw new Error('missing OUTPUT_DIR')

export class ArticleCompiler {
	constructor (
		private outputDir: string = defaultOutputDir,
		mkDir = defaultMkrDir
	) {
		mkDir(outputDir)
	}

	async compile (digest: Digest): Promise<string> {
		const path = await digest.writeTo(this.outputDir)
		const cover = await this.generateCover(digest.humanDateString)

		return await this.convert(path, cover, digest.title)
	}

	private async generateCover (date: string) {
		return coverGenerator.generate(date)
	}

	private async convert (input: string, cover: string, title: string) {
		const output = input.replace(/\.html$/, '.mobi')

		await new Promise<void>((resolve, reject) => {
			convert({
				input: JSON.stringify(input),
				output: JSON.stringify(output),
				title: JSON.stringify(title),
				pageBreaksBefore: "'//h:h1'",
				chapter: "'//h:h1'",
				insertBlankLine: true,
				insertBlankLineSize: 1,
				minimumLineHeight: 180,
				tocFilter: JSON.stringify('Digest .+'),
				authors: JSON.stringify('Digest Bot'),
				cover: JSON.stringify(cover),
				smartenPunctuation: true,
				extraCss: JSON.stringify('* { font-family: sans-serif; }'),
				verbose: true
			}, (err?: Error) => {
				if (err) return reject(err)
				resolve()
			})
		})

		return output
	}
}
