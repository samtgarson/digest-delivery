export const humaniseDate = (date: Date | string): string => new Date(date).toLocaleString('en-GB', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})
