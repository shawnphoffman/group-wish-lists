import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

import Avatar from '@/components/Avatar'
import RenameListButton from '@/components/lists/buttons/RenameListButton'
import AddItem from '@/components/lists/create/AddItem'
import ListItemEditRow from '@/components/lists/create/ItemEditRow'

import { createClient } from '@/utils/supabase/server'

type Props = {
	params: {
		id: string
	}
}

export default async function EditList({ params }: Props) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	const {
		data: { user: currentUser },
	} = await supabase.auth.getUser()
	let { data, error } = await supabase
		.from('lists')
		.select('name,type,listItems:sorted_list_items(*),user:users(email,raw_user_meta_data->name)')
		.eq('id', params.id)
		.eq('user_id', currentUser?.id)
		.not('active', 'is', false)
		.single()

	if (error || !data) {
		console.error(error)
		return notFound()
	} else {
		// console.log(data)
	}

	const items = data.listItems
	const user = data.user

	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl px-3 opacity-0 animate-in">
			<div className="flex flex-col flex-1 gap-6">
				{/* Header */}
				<div className="flex flex-row items-center justify-between gap-2">
					<div className="flex flex-row items-center gap-4">
						{/* <BackButton /> */}
						<RenameListButton listId={params.id} name={data.name} />
					</div>
					{/* @ts-expect-error */}
					<Avatar name={user?.name || user?.email} className="hidden md:inline-flex" />
				</div>

				{/* Rows */}
				<div className="flex flex-col">
					{items?.length === 0 && <p className="text-gray-500 dark:text-gray-400">Nothing to see here... yet</p>}
					<div className="flex flex-col">{items?.map(item => <ListItemEditRow key={item.id} item={item} />)}</div>
				</div>

				{/* Add Item */}
				<AddItem listId={params.id} />
			</div>
		</div>
	)
}
