import convert from 'ebook-convert'
import { mocked } from 'ts-jest/utils'
import { ArticleCompiler } from '../article-compiler'
import { Digest } from '../digest'

jest.mock('ebook-convert', () =>
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  jest.fn((_: string, cb: (err?: Error) => void) => cb())
)

describe('compile articles', () => {
  const htmlPath = '/foo/path.html'
  const digest = {
    html: 'html',
    title: 'title',
    humanDateString: 'human date string',
    writeTo: jest.fn(() => htmlPath)
  } as unknown as Digest
  const mkdir = jest.fn()
  const coverPath = 'coverPath'
  const path = 'tmp/kindle'

  let result: string

  beforeEach(async () => {
    const compiler = new ArticleCompiler(path, mkdir)
    result = await compiler.compile(digest, coverPath)
  })

  it('returns the mobi path', () => {
    expect(result).toEqual('/foo/path.mobi')
  })

  it('creates the directories', () => {
    expect(mkdir).toHaveBeenCalledWith(path)
  })

  it('writes the html', async () => {
    expect(digest.writeTo).toHaveBeenCalledWith(path)
  })

  it('has a default value for output dir', () => {
    const compiler = new ArticleCompiler(undefined, mkdir)

    expect(compiler).toHaveProperty('outputDir', process.env.OUTPUT_DIR)
  })

  it('uses the correct options for converting', () => {
    expect(mocked(convert)).toHaveBeenCalledWith(
      {
        authors: '"Digest Bot"',
        chapter: "'//h:h1'",
        cover: JSON.stringify(coverPath),
        extraCss: '"* { font-family: sans-serif; }"',
        input: JSON.stringify('/foo/path.html'),
        insertBlankLine: true,
        insertBlankLineSize: 1,
        minimumLineHeight: 180,
        output: '"/foo/path.mobi"',
        pageBreaksBefore: '"//*[@class=page]"',
        smartenPunctuation: true,
        title: JSON.stringify(digest.title),
        tocFilter: '"Digest .+"',
        verbose: true
      },
      expect.any(Function)
    )
  })
})
