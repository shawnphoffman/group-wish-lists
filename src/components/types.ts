import { ItemPriorityType, ItemStatusType, ListCategoryType } from '@/utils/enums'

/* ------------- */
/* USER TYPES    */
/* ------------- */

export type User = {
	id: number
	display_name: string
	user_id: string
	birth_month: number
	birth_day: number
	image?: string
}

export type Recipient = Pick<User, 'id' | 'display_name' | 'image'>

export type ListEditor = Pick<User, 'user_id' | 'display_name'>

export type ListEditorWrapper = {
	user: ListEditor
}

/* ------------- */
/* CORE TYPES    */
/* ------------- */

export type List = {
	id: number
	active: boolean
	private: boolean
	primary: boolean
	name: string
	description?: string
	type: ListCategoryType
	user: User
	list_items: ListItem[]
	count?: number
	remaining_count?: number
	editors?: Array<ListEditorWrapper>
}

export type ListItem = {
	id: string
	list_id: List['id']
	title: string
	url?: string
	scrape?: ScrapeResponse
	status: ItemStatusType
	priority: ItemPriorityType
	notes?: string
	image_url?: string
	item_comments?: Comment[]
	archived: boolean
	price?: string
	created_at: Date
	quantity?: number
	tags?: string[]
	/* RELATIONSHIPS */
	additional_gifter_ids?: User['user_id'][]
}

/* ------------- */
/* LIST MAPPINGS */
/* ------------- */

export type ListSharedWithOthers = List & {
	editors?: Array<ListEditorWrapper>
	// user_shared_with_id: number
	// user_shared_with_user_id: string
	// user_shared_with_display_name: string
}

export type ListSharedWithMe = List & {
	sharer_display_name: string
	sharer_id: number
}

export type ListGiftIdeas = List & {
	owner_display_name: string
	owner_id: number
	is_list_owner: boolean
	is_list_recipient: boolean
}

/* ------------- */
/* WEIRD SHIT    */
/* ------------- */

export type OgImage = {
	url?: string
	type?: string
}

export type ScrapeResponse = {
	error?: boolean
	result?: {
		savedScrape?: {
			[key: string]: number | null
		}
		ogUrl?: string
		ogTitle?: string
		ogDescription?: string
		ogType?: string
		ogSiteName?: string
		ogPrice?: string
		ogPriceCurrency?: string
		ogAvailability?: string
		ogImage?: OgImage[]
		ogLocale?: string
		charset?: string
		requestUrl?: string
		success?: boolean
	}
	userAgent?: string
}

export type Comment = {
	id: number
	user: Pick<User, 'user_id' | 'display_name'>
	item_id: ListItem['id']
	comments: string
	edited_at?: Date
	created_at: Date
	isOwner?: boolean
	archived: boolean
}

export type Gift = {
	quantity?: number
	display_name?: User['display_name']
	item_id?: ListItem['id']
	gifter_user_id?: User['user_id']
	gifter_id?: User['id']
	additional_gifters?: Pick<User, 'user_id' | 'display_name'>[]
}

export type Purchase = {
	recipient_display_name?: User['display_name']
	recipient_user_id?: User['user_id']
	recipient_id?: User['id']
	gift_created_at?: Date
}
export type PurchaseAddon = {
	type: 'addon'
	list_id: List['id']
	description: string
	archived: boolean
}
