import { cookies } from 'next/headers'

import { getUser } from '@/app/actions'

import Code from '@/components/Code'
import ListRow from '@/components/lists/ListRow'

import { isDeployed } from '@/utils/environment'
import { createClient } from '@/utils/supabase/server'

export default async function GroupedLists() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	let { data: groups, error } = await supabase
		.from('users')
		.select('id,email,raw_user_meta_data->name,lists(*)')
		.not('lists', 'is', null)
		// TODO should this just disable things?
		.not('lists.active', 'is', false)

	if (error) {
		console.error(error)
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
						// className={`flex flex-col mb-8 ${userId === group.id ? 'border border-dashed p-4 pt-2 border-red-500 rounded-md' : ''}`}
						className={`flex flex-col mb-8 `}
					>
						<h2 className="text-2xl dark:text-white mb-2">{group.name || group.email}</h2>
						{group.lists?.length === 0 && <p className="text-gray-500 dark:text-gray-400">No lists yet.</p>}
						<div className="flex flex-col">
							{group.lists?.map(list => <ListRow key={list.id} list={list} canEdit={userId === group.id} />)}
						</div>
					</div>
				))}
			</div>
			{!isDeployed && <Code code={JSON.stringify(groups, null, 2)} />}
		</div>
	)
}
