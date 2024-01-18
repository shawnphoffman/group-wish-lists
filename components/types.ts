import { ItemPriorityType, ItemStatusType, ListCategoryType } from '@/utils/enums'

export type List = {
	id: number
	active: boolean
	name: string
	type: ListCategoryType
	user: User
	list_items: ListItem[]
	count?: number
}

export type ListItem = {
	id: string
	list_id: List['id']
	title: string
	url?: string
	scrape?: Scrape
	status: ItemStatusType
	priority: ItemPriorityType
	notes?: string
	image_url?: string
}

export type Gift = {
	quantity?: number
	display_name?: User['display_name']
	item_id?: ListItem['id']
	gifter_user_id?: User['user_id']
	gifter_id?: User['id']
}

export type User = {
	id: number
	display_name: string
	is_parent: boolean
	user_id: string
}

export type Recipient = Pick<User, 'id' | 'display_name'>

export interface Scrape {
	error: boolean
	result: Result
}

export interface Result {
	ogUrl: string
	ogTitle: string
	ogDescription: string
	ogImage: OgImage[]
	ogLocale: string
	charset: string
	requestUrl: string
	success: boolean
	error: string
}

export interface OgImage {
	url: string
	type: string
}
