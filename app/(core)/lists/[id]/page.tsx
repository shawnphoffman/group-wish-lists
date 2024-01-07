import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import Code from '@/components/Code'
import ListItemRow from '@/components/lists/ListItemRow'

import { isDeployed } from '@/utils/environment'
import { createClient } from '@/utils/supabase/server'

export default async function List({ params }: { params: { id: string } }) {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	let { data, error } = await supabase
		.from('lists')
		.select('name,type,listItems(*)')
		.eq('id', params.id)
		.not('active', 'is', false)
		.single()
	// .from('listItems')
	// .select('*,lists(name, type)')
	// .eq('list_id', params.id)
	// .not('lists.active', 'is', false)

	if (error) {
		console.error(error)
		return notFound()
	}

	const items = data?.listItems

	return (
		<div className="w-full animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<div className="flex-1 flex flex-col gap-6">
				<h1>{data?.name}</h1>

				<div className="container mx-auto px-4">
					<div className="flex flex-col">
						{items?.length === 0 && <p className="text-gray-500 dark:text-gray-400">No lists yet.</p>}
						<div className="flex flex-col">{items?.map(item => <ListItemRow key={item.id} item={item} />)}</div>
					</div>
				</div>
				{!isDeployed && <Code code={JSON.stringify(items, null, 2)} />}
			</div>
		</div>
	)
}
