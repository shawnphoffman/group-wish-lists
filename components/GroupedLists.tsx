import { cookies } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

import Code from './Code'

function ListItem({ list }: any) {
	if (!list) return null
	return (
		<a
			className="inline-flex items-center gap-x-3.5 py-3 px-4 text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg hover:text-green-500 focus:z-10 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:hover:text-green-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
			href="#"
		>
			{/* <svg
						className="flex-shrink-0 w-4 h-4"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
						<path d="M12 12v9" />
						<path d="m8 17 4 4 4-4" />
					</svg> */}
			{list.name}
		</a>
	)
}

export default async function GroupedLists() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	// let { data: lists, error: listsError } = await supabase.from('grouped_lists').select()
	let { data: groups, error: groupsError } = await supabase
		.from('users')
		.select('email,raw_user_meta_data->name, lists(*)')
		.not('lists', 'is', null)

	if (groupsError) {
		console.error(groupsError)
		return null
	}

	return (
		<div className="container mx-auto px-4">
			<div className="flex flex-col">
				{groups?.map(group => (
					<div key={group.email} className="flex flex-col mb-8">
						<h2 className="text-2xl dark:text-white mb-2">{group.name || group.email}</h2>
						{group.lists?.length === 0 && <p className="text-gray-500 dark:text-gray-400">No lists yet.</p>}
						<div className="flex flex-col">{group.lists?.map(list => <ListItem key={list.id} list={list} />)}</div>
					</div>
				))}
			</div>
			<Code code={JSON.stringify(groups, null, 2)} />
		</div>
	)
}
