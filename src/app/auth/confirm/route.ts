'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const token_hash = searchParams.get('token_hash')

	if (!token_hash) {
		return redirect('/auth/auth-code-error')
	} else {
		const cookieStore = await cookies()
		const supabase = createClient(cookieStore)
		const { error, data } = await supabase.auth.verifyOtp({ type: 'magiclink', token_hash })
		if (error) {
			return redirect('/auth/auth-code-error')
		}

		// Ensure session is properly set
		if (data.session) {
			await supabase.auth.setSession(data.session)
		}

		redirect(`/#update=${data?.user?.id || 'unknown'}`)
	}
}
