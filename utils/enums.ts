export const ListType = {
	Test: 'test',
	Christmas: 'christmas',
	Birthday: 'birthday',
	WishList: 'wishlist',
} as const

export const ItemPriority = {
	'Very High': 'veryhigh',
	High: 'high',
	Normal: 'normal',
	Low: 'low',
} as const
export type ItemPriorityType = (typeof ItemPriority)[keyof typeof ItemPriority]
