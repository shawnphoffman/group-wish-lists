export const ListCategory = {
	Christmas: 'christmas',
	Birthday: 'birthday',
	WishList: 'wishlist',
	Test: 'test',
} as const
export type ListCategoryType = (typeof ListCategory)[keyof typeof ListCategory]

export const ItemPriority = {
	'Very High': 'veryhigh',
	High: 'high',
	Normal: 'normal',
	Low: 'low',
} as const
export type ItemPriorityType = (typeof ItemPriority)[keyof typeof ItemPriority]

export const ItemStatus = {
	Incomplete: 'incomplete',
	Complete: 'complete',
	Partial: 'partial',
} as const
export type ItemStatusType = (typeof ItemStatus)[keyof typeof ItemStatus]
