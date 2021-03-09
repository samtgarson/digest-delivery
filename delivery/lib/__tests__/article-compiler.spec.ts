import { ArticleCompiler } from '../article-compiler'
import { Digest } from '../digest'

// eslint-disable-next-line promise/prefer-await-to-callbacks
jest.mock('ebook-convert', () => jest.fn((_: string, cb: (err?: Error) => void) => cb()))

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
})

