'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { ListType } from '@/components/me/MyLists'
import { List, ListItem, User } from '@/components/types'
import { ListCategory } from '@/utils/enums'
import { createClient } from '@/utils/supabase/server'

// Invalidating "/" at layout scope takes out both the nav/sidebar (which shows
// user lists) and whichever page the caller is on. This replaces the previous
// in-memory Map cache + client router.refresh() dance, which was broken on
// multi-instance serverless (writes invalidated only the instance that served
// them, leaving other instances to serve stale reads up to TTL).
const revalidateListsScope = () => {
	revalidatePath('/', 'layout')
}

const monthToNumber: { [key: string]: number } = {
	january: 1,
	february: 2,
	march: 3,
	april: 4,
	may: 5,
	june: 6,
	july: 7,
	august: 8,
	september: 9,
	october: 10,
	november: 11,
	december: 12,
}

const sortUserGroupsByBirthDate = (a: Partial<User>, b: Partial<User>) => {
	const currentDate = new Date()
	// const currentDate = new Date('July 17, 2024 03:24:00')
	const currentMonth = currentDate.getMonth() + 1
	const currentDay = currentDate.getDate()
	let aMonth = monthToNumber[a.birth_month!]
	if (aMonth < currentMonth) {
		aMonth += 12
	} else if (aMonth === currentMonth && a.birth_day! < currentDay) {
		aMonth += 12
	}

	let bMonth = monthToNumber[b.birth_month!]
	if (bMonth < currentMonth) {
		bMonth += 12
	} else if (bMonth === currentMonth && b.birth_day! < currentDay) {
		bMonth += 12
	}

	if (aMonth <= currentMonth && a.birth_day === currentDay) {
		return -1
	}
	if (bMonth <= currentMonth && b.birth_day === currentDay) {
		return 1
	}

	if (aMonth === bMonth) {
		return a.birth_day! - b.birth_day!
	}
	return aMonth! - bMonth!
}

export const getListsGroupedByUser = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase
		.from('view_users')
		.select('id,user_id,email,display_name,birth_month,birth_day,image,lists:view_sorted_lists(*)')
		.not('lists', 'is', null)
		.order('id', { ascending: true })

	try {
		if (resp.data) {
			resp.data.sort(sortUserGroupsByBirthDate)
		}
	} catch (error) {
		console.error('getListsGroupedByUser.resp.error', error)
	}

	return resp as any
}

export const getMyLists = async (type = 'all') => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	let resp

	if (type === ListType.PUBLIC) {
		resp = await supabase.from('view_my_lists').select('*').is('private', false)
	} else if (type === ListType.PRIVATE) {
		resp = await supabase.from('view_my_lists').select('*').is('private', true).not('type', 'eq', ListCategory.GiftIdeas)
	} else if (type === ListType.GIFT_IDEAS) {
		resp = await supabase.from('view_list_gift_ideas').select('*')
	} else if (type === ListType.SHARED_WITH_ME) {
		resp = await supabase.from('view_shared_with_me').select('*').not('type', 'eq', ListCategory.GiftIdeas)
	} else if (type === ListType.SHARED_WITH_OTHERS) {
		resp = await supabase.from('view_shared_with_others').select(`
			*,
			editors:list_editors(user:user_id(display_name, user_id))
			`)
	} else {
		resp = await supabase.from('view_my_lists').select('*')
	}

	return resp
}

export const getEditableList = async (listID: number) => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const viewingUserID = data?.user?.id

	const resp = await supabase
		.from('view_my_lists2')
		.select(
			`name, type, active, user_id, description, private,
			recipient:recipient_user_id(id, display_name, user_id),
			listItems:view_sorted_list_items!list_items_list_id_fkey(
				*,
				item_comments!item_comments_item_id_fkey(
					id,
					item_id,
					comments,
					created_at,
					edited_at,
					archived,
					user:user_id(user_id, display_name)
				)
			),
			editors:list_editors(user:user_id(display_name, user_id))`
		)
		.eq('id', listID)
		.single()
		.then(async list => {
			const updatedItems = list.data?.listItems?.map((item: any) => {
				return {
					...item,
					item_comments: item?.item_comments
						?.map((comment: any) => {
							if (comment.archived && comment.user.user_id !== viewingUserID) {
								return null
							}
							return {
								...comment,
								isOwner: comment.user.user_id === viewingUserID,
							}
						})
						.filter((comment: any) => comment),
				}
			})

			if (list?.data?.listItems && updatedItems) {
				list.data.listItems = updatedItems
			}

			return {
				...(list as any),

				isOwner: list.data?.user_id === viewingUserID,
				viewingUserID,
			}
		})

	return resp as any
}

export const getViewableList = async (listID: number) => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const viewingUserID = data?.user?.id

	const resp = await supabase
		.from('lists')
		.select(
			`name,type,user_id,description,
			recipient:recipient_user_id(id,display_name,user_id,image),
			listItems:view_sorted_list_items!list_items_list_id_fkey(
				*,
				item_comments!item_comments_item_id_fkey(
					id,
					item_id,
					comments,
					created_at,
					edited_at,
					archived,
					user:user_id(user_id, display_name)
				)
			)`
		)
		.eq('id', listID)
		.eq('private', false)
		.not('active', 'is', false)
		.maybeSingle()
		.then(async list => {
			const updatedItems = list.data?.listItems?.map((item: any) => {
				return {
					...item,
					item_comments: item?.item_comments
						?.map((comment: any) => {
							if (comment.archived && comment.user.user_id !== viewingUserID) {
								return null
							}

							return {
								...comment,
								isOwner: comment.user.user_id === viewingUserID,
							}
						})
						.filter((comment: any) => comment),
				}
			})

			if (list?.data?.listItems && updatedItems) {
				list.data.listItems = updatedItems
			}

			return {
				...list,

				isOwner: list.data?.user_id === viewingUserID,
				viewingUserID,
			}
		})

	return resp
}

export const getListAddons = async (listID: number) => {
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const viewingUserID = data?.user?.id

	const resp = await supabase
		.from('list_addons')
		.select(`id,created_at,description,total_cost,notes,user:user_id(user_id, display_name)`)
		.eq('list_id', listID)
		.is('archived', false)
		.order('created_at', { ascending: false })
		.then(async addons => {
			const updatedAddons = addons.data?.map((addon: any) => {
				return {
					...addon,
					is_gifter: addon.user.user_id === viewingUserID,
				}
			})

			if (addons?.data && updatedAddons) {
				addons.data = updatedAddons
			}

			return addons
		})

	return resp as any
}

export const createList = async (prevState: any, formData: FormData) => {
	'use server'
	const name = formData.get('list-name') as string
	const type = formData.get('list-type') as string
	let owner = formData.get('list-owner') as string
	const isPrivate = type === ListCategory.GiftIdeas ? true : (formData.get('list-privacy') as string) === 'private'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	if (!name?.trim()) {
		return {
			status: 'error',
			message: 'List name is required',
		}
	}
	if (!owner) {
		const { data } = await supabase.auth.getUser()
		owner = data?.user?.id!
	}

	const { data: list, error } = await supabase
		.from('lists')
		.insert({ recipient_user_id: owner, name, active: true, type, private: isPrivate })
		.select()

	if (error) {
		console.error('createList.error', error)
		return { status: 'error', message: error.message }
	}

	revalidateListsScope()

	return {
		status: 'success',
		list: { data: list },
	}
}

export const renameList = async (prevState: any, formData: FormData) => {
	'use server'
	const name = formData.get('list-name') as string
	const type = formData.get('list-type') as string
	const isPrivate = (formData.get('list-privacy') as string) === 'private'
	const description = formData.get('list-description') as string
	const id = formData.get('id') as string
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.from('lists').update({ name, type, private: isPrivate, description }).eq('id', id)

	if (error) {
		console.error('renameList.error', error)
		return { status: 'error', message: error.message }
	}

	revalidateListsScope()

	return {
		status: 'success',
	}
}

export const archiveList = async (listID: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.from('lists').update({ active: false }).eq('id', listID)

	if (error) {
		console.error('archiveList.error', error)
		return { status: 'error', message: error.message }
	}

	revalidateListsScope()

	return {
		status: 'success',
	}
}

export const unarchiveList = async (listID: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.from('lists').update({ active: true }).eq('id', listID)

	if (error) {
		console.error('unarchiveList.error', error)
		return { status: 'error', message: error.message }
	}

	revalidateListsScope()

	return {
		status: 'success',
	}
}

export const deleteList = async (listID: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.from('lists').delete().eq('id', listID)

	if (error) {
		console.error('deleteList.error', error)
		return { status: 'error', message: error.message }
	}

	revalidateListsScope()

	return {
		status: 'success',
	}
}

export const getUserEditors = async () => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.auth.getUser()
	const editorUserId = data?.user?.id!

	const resp = await supabase.from('user_editors').select('editor:owner_user_id(user_id, display_name)').eq('editor_user_id', editorUserId)

	let newListsFor: { user_id: string; display_name: string }[] = []

	if (resp.data) {
		// @ts-expect-error TODO: fix this
		newListsFor = [...newListsFor, ...resp.data.map(result => result.editor)]
	}

	return newListsFor
}

export const getListEditors = async (listID: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)
	const resp = await supabase.from('list_editors').select('id, user_id, list_id').eq('list_id', listID)

	if (resp.data) {
		return resp.data.map((editor: { user_id: string }) => editor.user_id)
	}

	return []
}

export const createEditor = async (listId: List['id'], editorId: User['user_id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.from('list_editors').insert([{ list_id: listId, user_id: editorId }])

	if (error) {
		// 23505 = editor already exists for this list; treat as a no-op success.
		if (error.code !== '23505') {
			console.error('createEditor.error', error)
			return { status: 'error', message: error.message }
		}
	}

	revalidateListsScope()

	return {
		status: 'success',
	}
}

export const deleteEditor = async (listId: List['id'], editorId: User['user_id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.from('list_editors').delete().eq('list_id', Number(listId)).eq('user_id', editorId)

	if (error) {
		console.error('deleteEditor.error', error)
		return { status: 'error', message: error.message }
	}

	revalidateListsScope()

	return {
		status: 'success',
	}
}

export type PrimaryListResult =
	| { status: 'success' }
	| { status: 'conflict' }
	| { status: 'error'; message: string }

export const setPrimaryList = async (listId: List['id']): Promise<PrimaryListResult> => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data: userData } = await supabase.auth.getUser()
	const userId = userData?.user?.id

	if (!userId) {
		return { status: 'error', message: 'not_authenticated' }
	}

	// Clear existing primary first. This is non-atomic with the UPDATE below;
	// the partial unique index `lists_one_primary_per_user` is what actually
	// prevents two primaries existing simultaneously across concurrent calls.
	const { error: resetErr } = await supabase
		.from('lists')
		.update({ primary: false })
		.eq('user_id', userId)
		.eq('primary', true)

	if (resetErr) {
		console.error('setPrimaryList.reset', resetErr)
		return { status: 'error', message: resetErr.message }
	}

	const { error: setErr } = await supabase.from('lists').update({ primary: true }).eq('id', listId)

	if (setErr) {
		// 23505 -> a concurrent call already claimed primary for a different list.
		// The client should reconcile by refreshing rather than showing success.
		if (setErr.code === '23505') {
			revalidateListsScope()
			return { status: 'conflict' }
		}
		console.error('setPrimaryList.set', setErr)
		return { status: 'error', message: setErr.message }
	}

	revalidateListsScope()

	return {
		status: 'success',
	}
}

export const unsetPrimaryList = async (listId: List['id']): Promise<PrimaryListResult> => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { error } = await supabase.from('lists').update({ primary: false }).eq('id', listId)

	if (error) {
		console.error('unsetPrimaryList.error', error)
		return { status: 'error', message: error.message }
	}

	revalidateListsScope()

	return {
		status: 'success',
	}
}

export const getListById = async (id: List['id']) => {
	'use server'
	const cookieStore = await cookies()
	const supabase = createClient(cookieStore)

	const { data } = await supabase.from('lists').select().eq('id', id).single()

	return data
}
