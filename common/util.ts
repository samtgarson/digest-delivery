import { formatRelative } from "date-fns"

export const stringToDate = (date: string | Date): Date => date instanceof Date ? date : new Date(date)

export const humaniseDate = (date: string | Date): string => stringToDate(date).toLocaleString('en-GB', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})

export const dateString = (date: Date | string = new Date()): string => {
	const str = stringToDate(date).toISOString()
	return str.substr(0, str.indexOf('T'))
}

export const relativeDate = (date: Date): string => formatRelative(date, new Date()).split(' at')[0]
