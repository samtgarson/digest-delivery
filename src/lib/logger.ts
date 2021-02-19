export const log = (...args: string[]) => process.env.DEBUG && console.log(...args)
