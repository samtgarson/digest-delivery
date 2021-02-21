import { ArticleCompiler } from '../article-compiler'
import * as CoverGenerator from '../cover-generator'
import * as MockCoverGenerator from '../__mocks__/cover-generator'
import { Digest } from '../digest'

jest.mock('ebook-convert')
jest.mock('../cover-generator')
const { generateMock } = CoverGenerator as unknown as typeof MockCoverGenerator

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
    generateMock.mockResolvedValue(coverPath)

    const compiler = new ArticleCompiler(path, mkdir)
    result = await compiler.compile(digest)
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

  it('generates a cover', async () => {
    expect(generateMock).toHaveBeenCalledWith('human date string')
  })

  it('has a default value for output dir', () => {
    const compiler = new ArticleCompiler()

    expect(compiler).toHaveProperty('outputDir', process.env.OUTPUT_DIR)
  })
})

