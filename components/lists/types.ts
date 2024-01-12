export type ListItemType = {
	id?: string
	scrape?: {
		result?: {
			ogImage?: {
				url: string
			}[]
			ogTitle: string
		}
	}
	priority: string
	title: string
	notes?: string
	url?: string
	list_id: string
	image_url?: string
}
