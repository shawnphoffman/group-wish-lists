'use server'
import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function GET(req) {
	const { searchParams } = new URL(req.url)
	const token_hash = searchParams.get('token_hash')
	// const next = searchParams.get('next') ?? '/'
	if (!token_hash) {
		console.log('no hash', { token_hash })
		return redirect('/auth/auth-code-error')
	} else {
		const cookieStore = await cookies()
		const supabase = createClient(cookieStore)
		const { error, data } = await supabase.auth.verifyOtp({ type: 'magiclink', token_hash })
		if (error) {
			// return the user to an error page with some instructions
			return redirect('/auth/auth-code-error')
		}
		await supabase.auth.setSession(data.session!)
		console.log('no error', { data, token_hash })
		// return NextResponse.redirect(new URL(`/${next.slice(1)}`, req.url))
		return redirect(`/`)
	}
}
