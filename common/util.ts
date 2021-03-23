import { formatISO, formatRelative, parseISO } from "date-fns"

export const stringToDate = (date: string | Date): Date => date instanceof Date ? date : new Date(date)

export const humaniseDate = (date: string | Date): string => stringToDate(date).toLocaleString('en-GB', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

export const dateString = (date: Date | string = new Date()): string => formatISO(stringToDate(date), { representation: 'date' })

export const relativeDate = (date: Date | string): string => {
	const raw = formatRelative(stringToDate(date), new Date())

	const split = raw.split(' at')
	return split.length > 1
		? split[0]
		: humaniseDate(date)
}

const dateRegex = /^[0-9]{4}(-[0-9]{2}){2}T[0-9]{2}(:[0-9]{2}){2}/
export const hydrate = (obj: unknown): unknown => {
	if (Array.isArray(obj)) return obj.map(hydrate)
	if (typeof obj !== 'object') return obj
	if (!obj) return obj

	return Object.entries(obj).reduce((hsh, [k, v]) => ({
		...hsh,
		[k]: obj.constructor.name === 'object'
			? hydrate(v)
			: typeof v === 'string' && dateRegex.exec(v)
				? parseISO(v)
				: v
	}), {})
}

const replacer = (_: string, val: unknown) => {
	if (val instanceof Date) return formatISO(val)
	return val
}

export const dehydrate = (obj: unknown): string => {
	return JSON.stringify(obj, replacer)
}
