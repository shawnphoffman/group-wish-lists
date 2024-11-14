import { format, formatRelative, isBefore, subMonths } from 'date-fns'

export function formatDateBasedOnAge(date) {
	const sixMonthsAgo = subMonths(new Date(), 6)

	if (isBefore(date, sixMonthsAgo)) {
		// If the date is older than 6 months, return relative format
		return formatRelative(date, new Date())
	} else {
		// Otherwise, return the month and day format
		return format(date, 'MMM d')
	}
}
