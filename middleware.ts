import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
	try {
		// This `try/catch` block is only here for the interactive tutorial.
		// Feel free to remove once you have Supabase connected.
		const { supabase, response } = createClient(request)

		// Refresh session if expired - required for Server Components
		// https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
		const session = await supabase.auth.getSession()
		const hasSession = !!session.data.session
		// console.log('middleware.session', { hasSession, session: session.data.session, url: request.url })

		// IF THERE IS A SESSION, DO NOT ALLOW LOGIN
		if (hasSession && request.url.includes('/login')) {
			console.log('⤴️ REDIRECT TO ROOT')
			return NextResponse.redirect(new URL('/', request.url))
		}

		// IF THERE IS NO SESSION, REDIRECT TO LOGIN
		if (!request.url.includes('/login') && !request.url.includes('/auth')) {
			if (!hasSession) {
				console.log('⤵️ REDIRECT TO LOGIN')
				return NextResponse.redirect(new URL('/login', request.url))
			}
		}

		return response
	} catch (e) {
		// If you are here, a Supabase client could not be created!
		// This is likely because you have not set up environment variables.
		// Check out http://localhost:3000 for Next Steps.
		return NextResponse.next({
			request: {
				headers: request.headers,
			},
		})
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
}
