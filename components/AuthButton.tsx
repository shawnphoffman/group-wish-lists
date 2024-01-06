import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AuthButton() {
	const cookieStore = cookies()
	const supabase = createClient(cookieStore)

	const signOut = async () => {
		'use server'
		const cookieStore = cookies()
		const supabase = createClient(cookieStore)
		await supabase.auth.signOut()
		return redirect('/login')
	}

	const {
		data: { user },
	} = await supabase.auth.getUser()

	return user ? (
		<div className="flex items-center gap-4">
			Hey, {user.email}!
			<form action={signOut}>
				<button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">Logout</button>
			</form>
		</div>
	) : (
		<Link href="/login" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
			Login
		</Link>
	)
}
