import { cookies } from 'next/headers'
import { Suspense } from 'react'

import { getUser } from '@/app/actions/auth'

import ListRow from '@/components/lists/ListRow'

import { createClient } from '@/utils/supabase/server'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'

const Fallback = () => <FontAwesomeIcon className="fa-sharp fa-solid fa-compact-disc fa-spin" />

export default async function GroupedLists() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	let { data: groups, error } = await supabase
		.from('users')
		.select('id,email,raw_user_meta_data->name,lists(*)')
		.not('lists', 'is', null)
		.order('id', { ascending: true })

	if (error) {
		console.error(error)
		return null
	}

	const { data } = await getUser()
	const userId = data?.user?.id

	return (
		<div className="container px-4 mx-auto">
			<div className="flex flex-col">
				{groups?.map(group => (
					<div key={group.email} className={`flex flex-col mb-8 `}>
						<h2 className="mb-2 text-2xl dark:text-white">{group.name || group.email}</h2>
						<Suspense fallback={<Fallback />}>
							{group.lists?.length === 0 && <p className="text-gray-500 dark:text-gray-400">No lists yet.</p>}
							<div className="flex flex-col">
								{group.lists.sort((a, b) => a.id - b.id)?.map(list => <ListRow key={list.id} list={list} canEdit={userId === group.id} />)}
							</div>
						</Suspense>
					</div>
				))}
			</div>
		</div>
	)
}
