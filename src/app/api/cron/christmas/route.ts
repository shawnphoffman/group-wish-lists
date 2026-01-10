import { NextResponse } from 'next/server'

import ChristmasEmail from '@/emails/christmas-email'
import { resendClient, getFromEmail, getBccAddress, commonEmailProps } from '@/utils/resend'
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

	// Fetch emails from auth.users via Admin API and send using batch API
	const users = data?.users || []
	const MAX_BATCH_SIZE = 100 // Resend batch API supports up to 100 emails per request

	// Filter users with valid emails and prepare email payloads
	const emailPayloads = users
		.filter(user => user?.email)
		.map(user => ({
			...commonEmailProps(),
			to: user.email!,
			subject: 'Merry Christmas! 🎄',
			react: ChristmasEmail(),
		}))

	if (emailPayloads.length === 0) {
		return NextResponse.json({ sent: 0, message: 'No users with valid emails' })
	}

	// Process in batches of 100 (Resend's limit)
	const results: Array<{ id: string; ok: boolean; error?: string }> = []

	for (let i = 0; i < emailPayloads.length; i += MAX_BATCH_SIZE) {
		const batch = emailPayloads.slice(i, i + MAX_BATCH_SIZE)
		const batchUserIds = users
			.filter(user => user?.email)
			.slice(i, i + MAX_BATCH_SIZE)
			.map(user => user.id)

		console.log(
			`Sending batch ${Math.floor(i / MAX_BATCH_SIZE) + 1} of ${Math.ceil(emailPayloads.length / MAX_BATCH_SIZE)} (${batch.length} emails)`
		)

		try {
			const { data: batchData, error: batchError } = await resendClient.batch.send(batch)

			if (batchError) {
				// If entire batch fails, mark all as failed
				batchUserIds.forEach(userId => {
					results.push({ id: userId, ok: false, error: batchError.message })
				})
			} else if (batchData && Array.isArray(batchData)) {
				// Map successful email IDs back to user IDs
				batchUserIds.forEach((userId, index) => {
					const emailResult = batchData[index]
					if (emailResult && 'id' in emailResult && emailResult.id) {
						results.push({ id: userId, ok: true })
					} else {
						results.push({ id: userId, ok: false, error: 'No email ID returned' })
					}
				})
			}
		} catch (e: any) {
			// If batch throws an error, mark all as failed
			batchUserIds.forEach(userId => {
				results.push({ id: userId, ok: false, error: e?.message || 'Unknown error' })
			})
		}
	}

	return NextResponse.json({ sent: results.filter(r => r.ok).length, results })
}
