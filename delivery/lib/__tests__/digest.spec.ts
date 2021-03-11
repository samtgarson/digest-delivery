import type { Article } from 'types/digest'
import { writeFile } from 'fs'
import { Digest } from '../../lib/digest'
import { mocked } from 'ts-jest/utils'

const userId = 'user id'

const writeFileMock = mocked(writeFile)
jest.mock('fs')

const article1: Article = {
  id: '1',
  user_id: userId,
  created_at: '2021-03-01T12:00:00Z',
  content: 'content 1',
  title: 'title 1',
  author: 'author 1'
}

const article2: Article = {
  id: '2',
  user_id: userId,
  created_at: '2021-03-01T12:00:00Z',
  content: 'content 2',
  title: 'title 2'
}

describe('digest', () => {
  const isoDate = 'iso date'
  const date = new Date()
  date.toLocaleString = jest.fn(() => 'locale string')
  date.toISOString = jest.fn(() => `${isoDate}T time`)

  const digest = new Digest(userId, [article1, article2], date)

  it('has a title', () => {
    expect(digest.title).toEqual('Digest (locale string)')
  })

  it('has a table of contents', () => {
    expect(digest.html).toEqual(
`<header>
<h1>Digest (locale string)</h1>
<p style="margin: 40px 0">You've got 2 articles to read!</p>
<ol>
<li><a href="#1">title 1</a><em>—author 1</em></li>
<li><a href="#2">title 2</a></li>
</ol>
</header>
<h1 id="1">title 1</h1>
<p style="color: #444; margin-bottom: 30px">By author 1</p>
content 1
<h1 id="2">title 2</h1>
content 2

<footer style="color: #444;">
<p>Generated by <a href="https://digest.delivery"><strong>digest.delivery</strong></a></p>
</footer>`
      )
  })

  describe('with only 1 articles', () => {
    const digest = new Digest(userId, [article1], date)

    it('has the correct gramar', () => {
      expect(digest.html).toMatch(/You've got 1 article/)
    })
  })

  describe('writeTo', () => {
    const dir = 'dir'
    const path = `${dir}/${userId}-${isoDate}.html`

    it('writes the file', async () => {
      await digest.writeTo(dir)
      expect(writeFileMock).toHaveBeenCalledWith(
        path,
        expect.any(String),
        expect.any(Function)
      )
    })

    it('returns the path', async () => {
      const result = await digest.writeTo(dir)
      expect(result).toEqual(path)
    })

    describe('when there is an error', () => {
      const error = new Error('oh no')

      beforeEach(() => {
        // eslint-disable-next-line promise/prefer-await-to-callbacks
        writeFileMock.mockImplementation((_p, _c, cb) => cb(error))
      })

      it('throws the error', async () => {
        expect(() => digest.writeTo(dir)).rejects.toEqual(error)
      })
    })
  })
})
