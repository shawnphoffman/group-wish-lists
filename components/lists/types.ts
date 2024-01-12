import { ItemPriorityType, ItemStatusType, ListCategoryType } from '@/utils/enums'

export type List = {
	id: string
	active: boolean
	name: string
	type: ListCategoryType
	user: User
	listItems: ListItem[]
}

export type ListItem = {
	id: string
	list_id: string
	title: string
	url?: string
	scrape?: Scrape
	status: ItemStatusType
	priority: ItemPriorityType
	notes?: string
	image_url?: string
}

export type User = {
	name: string
	email: string
}

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
