/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

const debug = process.env.DEBUG
export const log = (...args: string[]) => { debug && console.log(...args) }
export const errorLog = (...args: unknown[]) => { debug && console.error(...args) }

export const withPrefix = (prefix: string) => ({
	log: (...args: string[]) => log(`[${prefix}] `, ...args),
	error: (...args: string[]) => errorLog(`[${prefix}] `, ...args)
})
