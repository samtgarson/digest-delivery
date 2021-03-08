import { writeFile } from "fs"
import { Compilable, Article } from "types/digest"
import { humaniseDate } from "./util"

export class Digest implements Compilable {
	constructor (private articles: Article[], private date: Date) {}

	get title (): string {
		return `Digest (${this.humanDateString})`
	}

	get html (): string {
		return [
			'<header>',
			`<h1>${this.title}</h1>`,
			this.summary,
			this.toc,
			'</header>',
			this.chapters,
			this.footer
		].join('\n')
	}

	get humanDateString (): string {
		return humaniseDate(this.date)
	}

	async writeTo (dir: string): Promise<string> {
		const str = this.date.toISOString()
		const date = str.substr(0, str.indexOf('T'))

		const path = `${dir}/${date}.html`
		await new Promise<void>((resolve, reject) => writeFile(path, this.html, err => {
			if (err) return reject(err)
			return resolve()
		}))

		return path
	}

	private get summary () {
		const count = this.articles.length === 1 ? '1 article' : `${this.articles.length} articles`

		return `<p style="margin: 40px 0">You've got ${count} to read!</p>`
	}

	private get toc () {
		const items = this.articles.map(a => `<li><a href="#${a.id}">${a.title}</a><em>—${a.author}</em></li>`)
		return [
			'<ol>',
			...items,
			'</ol>'
		].join('\n')
	}

	private get chapters () {
		return this.articles.reduce((str, article) => {
			str += `<h1 id="${article.id}">${article.title}</h1>\n`
			if (article.author) str += `<p style="color: #444; margin-bottom: 30px">By ${article.author}</p>\n`
			str += article.content + '\n'
			return str
		}, '')
	}

	private get footer () {
		return `<footer style="color: #444;">
<p>Generated by <a href="samgarson.com">Digest Bot</a></p>
</footer>`
	}
}
