export const humaniseDate = (date: Date): string => date.toLocaleString('en-GB', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})
