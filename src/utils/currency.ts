/**
 * Parses a price value by removing formatting characters (dollar signs, commas, etc.)
 * and returning a clean numeric string suitable for input fields.
 *
 * @param value - The price value to parse (may contain $, commas, etc.)
 * @returns A cleaned numeric string (e.g., "$1,000.50" -> "1000.50")
 */
export const parsePriceValue = (value: string | null | undefined): string => {
	if (!value) return ''
	// Remove dollar signs, commas, and other non-numeric characters except decimal point
	const cleaned = value.toString().replace(/[^0-9.]/g, '')
	// Handle multiple decimal points by keeping only the first one
	const parts = cleaned.split('.')
	if (parts.length > 2) {
		return parts[0] + '.' + parts.slice(1).join('')
	}
	return cleaned
}

/**
 * Formats a price value for display. If it's a valid number, formats it with a dollar sign.
 * Otherwise, returns the original value as-is.
 *
 * @param price - The price value to format (may be a number string or formatted string like "$1-5")
 * @returns Formatted price string (e.g., "1" -> "$1", "$1-5" -> "$1-5")
 */
export const formatPriceDisplay = (price: string | null | undefined): string => {
	if (!price) return ''
	const priceStr = price.toString()
	// Try to parse as a number by removing non-numeric characters except decimal point
	const cleaned = priceStr.replace(/[^0-9.]/g, '')
	// Check if the cleaned string is a valid number format (only digits and at most one decimal point)
	const parts = cleaned.split('.')
	if (cleaned.length > 0 && parts.length <= 2 && /^\d+\.?\d*$/.test(cleaned)) {
		const numValue = parseFloat(cleaned)
		if (!isNaN(numValue)) {
			// It's a valid number, format it with dollar sign
			// Remove trailing zeros but keep the decimal point if there are significant decimals
			const formatted = numValue % 1 === 0 ? numValue.toString() : numValue.toFixed(2).replace(/\.?0+$/, '')
			return `$${formatted}`
		}
	}
	// Not a valid number, return as-is
	return priceStr
}
