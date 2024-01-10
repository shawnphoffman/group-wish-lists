import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

import Code from '@/components/Code'
import Avatar from '@/components/core/Avatar'
import RenameListButton from '@/components/lists/buttons/RenameListButton'
import ListItemEditRow from '@/components/lists/create/ItemEditRow'
import ScrapeItem from '@/components/lists/create/ScrapeItem'

import { isDeployed } from '@/utils/environment'
import { createClient } from '@/utils/supabase/server'

export default async function EditList({ params }: { params: { id: string } }) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const {
		data: { user: currentUser },
	} = await supabase.auth.getUser()
	let { data, error } = await supabase
		.from('lists')
		.select('name,type,listItems(*),users(email,raw_user_meta_data->name)')
		.eq('id', params.id)
		.eq('user_id', currentUser?.id)
		.not('active', 'is', false)
		// .order('listItems(priority)', { ascending: false })
		.single()

	if (error || !data) {
		console.error(error)
		return notFound()
	} else {
		// console.log(data)
	}

	const items = data.listItems
	const user = data.users

	return (
		<div className="w-full animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<div className="flex-1 flex flex-col gap-6">
				<div className="flex flex-row gap-2 items-center justify-between">
					<div className="flex flex-row gap-4 items-center">
						{/* <BackButton /> */}
						<RenameListButton listId={params.id} name={data.name} />
					</div>
					{/* @ts-expect-error */}
					<Avatar name={user?.name || user?.email} className="hidden md:inline-flex" />
				</div>

				<div className="container mx-auto px-4 flex flex-col gap-4">
					<div className="flex flex-col">
						{items?.length === 0 && <p className="text-gray-500 dark:text-gray-400">Nothing to see here... yet</p>}
						<div className="flex flex-col">{items?.map(item => <ListItemEditRow key={item.id} item={item} />)}</div>
					</div>
					<ScrapeItem listId={params.id} />
				</div>
				{!isDeployed && <Code code={JSON.stringify(data, null, 2)} />}
			</div>
		</div>
	)
}
