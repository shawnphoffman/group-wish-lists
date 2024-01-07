import { cookies } from 'next/headers'

import Code from '@/components/Code'

import { createClient } from '@/utils/supabase/server'

export default async function Core() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)
	let { data: lists, error } = await supabase.from('lists').select('*')

	return (
		<div className="animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<main className="flex-1 flex flex-col gap-6">
				<h1>Lists</h1>
				{error && <Code code={JSON.stringify(error, null, 2)} />}
				{lists && <Code code={JSON.stringify(lists, null, 2)} />}
			</main>
		</div>
	)
}
