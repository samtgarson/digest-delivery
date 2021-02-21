declare module 'node-ebook-converter' {
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
    verbose: boolean
  }

  export function convert (options: ConvertOptions): Promise<void>
}
