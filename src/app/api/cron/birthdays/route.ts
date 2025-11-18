import { NextResponse } from 'next/server'

import BirthdayEmail from '@/emails/happy-birthday-email'
import { resendClient } from '@/utils/resend'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(req: Request) {
	// Verify secret to prevent abuse
	const auth = req.headers.get('authorization')
	if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	const supabase = createAdminClient()

	// Get today (handle timezone at database or app level)
	const now = new Date()
	// const monthName = 'october'
	// const day = 9
	const monthName = now.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }).toLowerCase()
	const day = now.getUTCDate()

	// Query birthdays using discrete birth_month and birth_day columns
	const { data: users, error } = await supabase
		.from('users')
		.select('user_id,display_name,birth_month,birth_day')
		.eq('birth_month', monthName)
		.eq('birth_day', day)

	if (error) return NextResponse.json({ error: error.message }, { status: 500 })
	if (!users?.length) return NextResponse.json({ sent: 0 })

	// Fetch emails from auth.users via Admin API and send
	const results = await Promise.all(
		users.map(async (user: any) => {
			console.log('user', user)

			try {
				const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(user.user_id)
				if (userErr) return { id: user.user_id, ok: false, error: userErr.message }
				const recipient = userData?.user?.email
				if (!recipient) return { id: user.user_id, ok: false, error: 'No email for user' }

				await resendClient.emails.send(
					{
						from: process.env.RESEND_FROM_EMAIL!,
						to: recipient,
						bcc: ['shawn@sent.as'],
						subject: 'Happy Birthday! 🎂',
						react: BirthdayEmail({ name: user.display_name || 'user-with-no-name' }),
					},
					{
						idempotencyKey: `happy-birthday/${now.getFullYear()}/${user.user_id}`,
					}
				)

				return { id: user.user_id, ok: true }
			} catch (e: any) {
				return { id: user.user_id, ok: false, error: e?.message }
			}
		})
	)

	return NextResponse.json({ sent: results.filter(r => r.ok).length, results })
}
