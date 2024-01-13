import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

import { getUser } from '@/app/actions/auth'

import Avatar from '@/components/Avatar'
import RealTimeListener from '@/components/RealTimeListener'
import ListItemRow from '@/components/lists/ItemRow'

import { createClient } from '@/utils/supabase/server'

export default async function ViewList({ params }: { params: { id: string } }) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	let { data, error } = await supabase
		.from('lists')
		.select('name,type,listItems:sorted_list_items(*),user:temp_users(id,email,raw_user_meta_data->name)')
		.eq('id', params.id)
		.not('active', 'is', false)
		.single()

	if (error || !data) {
		return notFound()
	}

	const { data: currentUser } = await getUser()
	const userId = currentUser?.user?.id

	const items = data?.listItems
	const user = data?.user instanceof Array ? data?.user[0] : data?.user

	const isListOwner = !!(userId && userId === user?.id)

	return (
		<>
			<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
				<div className="flex flex-col flex-1 gap-6">
					<div className="flex flex-row items-center justify-between gap-2">
						<div className="flex flex-row items-center gap-4">
							<h1 className="">{data?.name}</h1>
						</div>
						<Avatar name={user?.name || user?.email} />
					</div>

					<div className="container px-4 mx-auto">
						<div className="flex flex-col">
							{items?.length === 0 && <p className="text-gray-500 dark:text-gray-400">Nothing to see here... yet</p>}
							<div className="flex flex-col">{items?.map(item => <ListItemRow key={item.id} item={item} isOwnerView={isListOwner} />)}</div>
						</div>
					</div>
				</div>
			</div>

			<RealTimeListener listId={params.id} />
		</>
	)
}
