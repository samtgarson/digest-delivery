import { mkdirSync } from 'fs'
import convert from 'ebook-convert'
import { Digest } from './digest'

const defaultOutputDir = process.env.OUTPUT_DIR as string
const defaultMkrDir = (path: string) => mkdirSync(path, { recursive: true })

if (!defaultOutputDir) throw new Error('missing OUTPUT_DIR')

export class ArticleCompiler {
	constructor (
		private outputDir: string = defaultOutputDir,
		mkDir = defaultMkrDir
	) {
		mkDir(outputDir)
	}

	async compile (digest: Digest, coverPath: string): Promise<string> {
		const path = await digest.writeTo(this.outputDir)

		if (process.env.SKIP_CALIBRE) return path

		return await this.convert(path, coverPath, digest.title)
	}

	private async convert (input: string, coverPath: string, title: string) {
		const output = input.replace(/\.html$/, '.mobi')

		await new Promise<void>((resolve, reject) => convert({
			input: JSON.stringify(input),
			output: JSON.stringify(output),
			title: JSON.stringify(title),
			pageBreaksBefore: JSON.stringify('//*[@class="page"]'),
			chapter: "'//h:h1'",
			insertBlankLine: true,
			insertBlankLineSize: 1,
			minimumLineHeight: 180,
			tocFilter: JSON.stringify('Digest .+'),
			authors: JSON.stringify('Digest Bot'),
			cover: JSON.stringify(coverPath),
			smartenPunctuation: true,
			extraCss: JSON.stringify('* { font-family: sans-serif; }'),
			verbose: true
		}, err => {
			if (err) reject(err)
			resolve()
		}))

		return output
	}
}
