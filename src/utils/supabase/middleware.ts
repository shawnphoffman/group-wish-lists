// import { type CookieOptions, createServerClient } from '@supabase/ssr'
// import { type NextRequest, NextResponse } from 'next/server'

import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	})

	const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
		cookies: {
			getAll() {
				return request.cookies.getAll()
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
				supabaseResponse = NextResponse.next({
					request,
				})
				cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
			},
		},
	})

	// IMPORTANT: Avoid writing any logic between createServerClient and
	// supabase.auth.getUser(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.

	const {
		data: { user },
	} = await supabase.auth.getUser()

	// console.log('updateSession.user', user)

	if (
		!user &&
		!request.nextUrl.pathname.startsWith('/login') &&
		!request.nextUrl.pathname.startsWith('/auth') &&
		!request.nextUrl.pathname.includes('.png') &&
		!request.nextUrl.pathname.includes('.css') &&
		!request.nextUrl.pathname.startsWith('/monitoring')
	) {
		// console.log('updateSession.NO USER', request.nextUrl.pathname)
		// no user, potentially respond by redirecting the user to the login page
		const oldUrl = request.nextUrl.clone()
		const url = request.nextUrl.clone()
		url.pathname = '/auth/login'
		url.searchParams.append('returnUrl', oldUrl.toString())

		return NextResponse.redirect(url)
	}

	// IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
	// creating a new response object with NextResponse.next() make sure to:
	// 1. Pass the request in it, like so:
	//    const myNewResponse = NextResponse.next({ request })
	// 2. Copy over the cookies, like so:
	//    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
	// 3. Change the myNewResponse object to fit your needs, but avoid changing
	//    the cookies!
	// 4. Finally:
	//    return myNewResponse
	// If this is not done, you may be causing the browser and server to go out
	// of sync and terminate the user's session prematurely!

	return supabaseResponse
}

// export const createClient = (request: NextRequest) => {
// 	// Create an unmodified response
// 	let response = NextResponse.next({
// 		request: {
// 			headers: request.headers,
// 		},
// 	})

// 	const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
// 		cookies: {
// 			get(name: string) {
// 				return request.cookies.get(name)?.value
// 			},
// 			set(name: string, value: string, options: CookieOptions) {
// 				// If the cookie is updated, update the cookies for the request and response
// 				request.cookies.set({
// 					name,
// 					value,
// 					...options,
// 				})
// 				response = NextResponse.next({
// 					request: {
// 						headers: request.headers,
// 					},
// 				})
// 				response.cookies.set({
// 					name,
// 					value,
// 					...options,
// 				})
// 			},
// 			remove(name: string, options: CookieOptions) {
// 				// If the cookie is removed, update the cookies for the request and response
// 				request.cookies.set({
// 					name,
// 					value: '',
// 					...options,
// 				})
// 				response = NextResponse.next({
// 					request: {
// 						headers: request.headers,
// 					},
// 				})
// 				response.cookies.set({
// 					name,
// 					value: '',
// 					...options,
// 				})
// 			},
// 		},
// 	})

// 	return { supabase, response }
// }
