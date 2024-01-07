import { cookies } from 'next/headers'

import { getUser } from '@/app/actions'

import { createClient } from '@/utils/supabase/server'

import Code from './Code'
import ListTypeIcon from './ListTypeIcon'

function ListItem({ list, canEdit }: any) {
	if (!list) return null

	return (
		<a
			className="inline-flex items-center gap-x-3.5 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg hover:text-green-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:hover:text-green-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
			href="#"
		>
			<ListTypeIcon type={list.type} />
			<div className="flex-1">{list.name}</div>
			{canEdit && <i className={`fa-sharp fa-solid fa-pen-to-square text-lg`} />}
		</a>
	)
}

export default async function GroupedLists() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	let { data: groups, error: groupsError } = await supabase
		.from('users')
		.select('id,email,raw_user_meta_data->name,lists(*)')
		.not('lists', 'is', null)
		// TODO should this just disable things?
		.not('lists.active', 'is', false)

	if (groupsError) {
		console.error(groupsError)
		return null
	}

	const { data } = await getUser()
	const userId = data?.user?.id

	return (
		<div className="container mx-auto px-4">
			<div className="flex flex-col">
				{groups?.map(group => (
					<div
						key={group.email}
						className={`flex flex-col mb-8 ${userId === group.id ? 'border border-dashed p-4 pt-2 border-red-500 rounded-md' : ''}`}
					>
						<h2 className="text-2xl dark:text-white mb-2">{group.name || group.email}</h2>
						{group.lists?.length === 0 && <p className="text-gray-500 dark:text-gray-400">No lists yet.</p>}
						<div className="flex flex-col">
							{group.lists?.map(list => <ListItem key={list.id} list={list} canEdit={userId === group.id} />)}
						</div>
					</div>
				))}
			</div>
			<Code code={JSON.stringify(groups, null, 2)} />
		</div>
	)
}
