declare module 'ebook-convert' {
  export interface ConvertOptions {
    input: string
    output: string
    title: string
    authors: string
    pageBreaksBefore: string
    chapter: string
    insertBlankLine: boolean
    insertBlankLineSize: number
    tocFilter: string
    minimumLineHeight: number
    cover: string
    smartenPunctuation: boolean
    extraCss: string
  }

  export default function (options: ConvertOptions, callback: (err?: Error) => void): Promise<void>
}
