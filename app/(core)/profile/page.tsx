import Code from '@/components/Code'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Core() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	return (
		<div className="animate-in flex-1 flex flex-col opacity-0 max-w-4xl px-3">
			<main className="flex-1 flex flex-col gap-6">
				<h1>Profile</h1>
				<form>
					<input type="text" />
				</form>
				<Code code={JSON.stringify(user, null, 2)} />
			</main>
		</div>
	)
}
