import { formatISO, formatRelative } from "date-fns"

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
