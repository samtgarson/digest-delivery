export const writeFile = jest.fn(
  // eslint-disable-next-line promise/prefer-await-to-callbacks
  (_path: string, _content: string, cb: (err?: Error) => void) => cb()
)
