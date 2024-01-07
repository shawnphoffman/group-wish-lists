import { cookies } from 'next/headers'
// import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import BackButton from '@/components/BackButton'
import Code from '@/components/Code'
import Avatar from '@/components/core/Avatar'
import ListItemRow from '@/components/lists/ListItemRow'

import { isDeployed } from '@/utils/environment'
import { createClient } from '@/utils/supabase/server'

export default async function ViewList({ params }: { params: { id: string } }) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	let { data, error } = await supabase
		.from('lists')
		.select('name,type,listItems(*),users(email,raw_user_meta_data->name)')
		.eq('id', params.id)
		.not('active', 'is', false)
		.single()

	if (error) {
		console.error(error)
		return notFound()
	}

	const items = data?.listItems
	const user = data?.users

	return (
		<div className="w-full animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<div className="flex-1 flex flex-col gap-6">
				<div className="flex flex-row gap-2 items-center">
					<BackButton />
					<h1 className="">{data?.name}</h1>
					{/* @ts-expect-error */}
					<Avatar name={user?.name || user?.email} />
				</div>

				<div className="container mx-auto px-4">
					<div className="flex flex-col">
						{items?.length === 0 && <p className="text-gray-500 dark:text-gray-400">Nothing to see here... yet</p>}
						<div className="flex flex-col">{items?.map(item => <ListItemRow key={item.id} item={item} />)}</div>
					</div>
				</div>
				{!isDeployed && <Code code={JSON.stringify(data, null, 2)} />}
			</div>
		</div>
	)
}
