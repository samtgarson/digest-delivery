export const log = (...args: string[]): void => { process.env.DEBUG && console.log(...args) }
export const withPrefix = (prefix: string) => (...args: string[]): void => log(`[${prefix}] `, ...args)
