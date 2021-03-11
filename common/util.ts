export const humaniseDate = (date: string | Date): string => (date instanceof Date ? date : new Date(date)).toLocaleString('en-GB', {
	day: 'numeric',
	month: 'short',
	year: 'numeric'
})
