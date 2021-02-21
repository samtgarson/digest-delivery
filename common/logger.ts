export const log = (...args: string[]): void => { process.env.DEBUG && console.log(...args) }
