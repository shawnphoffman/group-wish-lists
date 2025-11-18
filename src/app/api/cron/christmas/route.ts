import { NextResponse } from 'next/server'

import ChristmasEmail from '@/emails/christmas-email'
import { resendClient } from '@/utils/resend'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(req: Request) {
	// Verify secret to prevent abuse
	const auth = req.headers.get('authorization')
	if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	const supabase = createAdminClient()

	const now = new Date()
	const monthName = now.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }).toLowerCase()
	const day = now.getUTCDate()

	if (monthName !== 'december' || day !== 25) {
		return NextResponse.json({ sent: 0, message: 'Not Christmas' })
	}

	const { data, error } = await supabase.auth.admin.listUsers()

	if (error) return NextResponse.json({ error: error.message }, { status: 500 })

	// Fetch emails from auth.users via Admin API and send
	const results = await Promise.all(
		data?.users.map(async user => {
			console.log('user', user)

			try {
				if (!user?.email) return { id: user?.id, ok: false, error: 'No email for user' }

				await resendClient.emails.send(
					{
						from: process.env.RESEND_FROM_EMAIL!,
						to: user?.email,
						bcc: ['shawn@sent.as'],
						subject: 'Merry Christmas! 🎄',
						react: ChristmasEmail(),
					},
					{
						idempotencyKey: `merry-christmas/${now.getFullYear()}/${user.id}`,
					}
				)

				return { id: user.id, ok: true }
			} catch (e: any) {
				return { id: user.id, ok: false, error: e?.message }
			}
		})
	)

	return NextResponse.json({ sent: results.filter(r => r.ok).length, results })
}
