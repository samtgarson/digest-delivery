/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const debug = process.env.DEBUG
export const log = (...args: unknown[]) => {
  debug && console.log(...args)
}
export const errorLog = (...args: unknown[]) => {
  debug && console.error(...args)
}
export const warnLog = (...args: unknown[]) => {
  debug && console.warn(...args)
}

export const withPrefix = (prefix: string) => ({
  log: (...args: unknown[]) => log(`[${prefix}] `, ...args),
  error: (...args: unknown[]) => errorLog(`[${prefix}] `, ...args),
  warn: (...args: unknown[]) => warnLog(`[${prefix}] `, ...args)
})
