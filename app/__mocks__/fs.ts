// eslint-disable-next-line promise/prefer-await-to-callbacks
export const writeFile = jest.fn((_path: string, _content: string, cb: (err?: Error) => void) => cb())
