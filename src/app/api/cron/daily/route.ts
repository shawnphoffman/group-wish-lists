import { NextResponse } from 'next/server'

import PostBirthdayEmail from '@/emails/post-birthday-email'
import { resendClient, getFromEmail, getBccAddress, commonEmailProps } from '@/utils/resend'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(req: Request) {
	// Verify secret to prevent abuse
	const auth = req.headers.get('authorization')
	if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	const supabase = createAdminClient()

	// Yes, this goes back 14 days from now (UTC) and extracts the month and day.
	const now = new Date()
	const fourteenDaysAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 14))
	const monthName = fourteenDaysAgo.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' }).toLowerCase()
	const day = fourteenDaysAgo.getUTCDate()

	// Query birthdays using discrete birth_month and birth_day columns
	const { data: allusers, error } = await supabase.from('users').select('user_id,display_name,birth_month,birth_day')

	if (error) return NextResponse.json({ error: error.message }, { status: 500 })

	const users = allusers?.filter((user: any) => user.birth_month === monthName && user.birth_day === day)

	if (!users?.length) return NextResponse.json({ updated: 0 })

	// Fetch emails from auth.users via Admin API and send
	const results = await Promise.all(
		users.map(async (user: any) => {
			console.log('user', user)

			try {
				const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(user.user_id)
				if (userErr) return { id: user.user_id, ok: false, error: userErr.message }
				const recipient = userData?.user?.email
				if (!recipient) return { id: user.user_id, ok: false, error: 'No email for user' }

				const lists = await supabase
					.from('lists')
					.select('id')
					.eq('recipient_user_id', user.user_id)
					.eq('active', true)
					.eq('private', false)

				const items = await supabase
					.from('list_items')
					.select('*,gifted_items(*,gifter_id)')
					.in('list_id', lists.data?.map((list: any) => list.id) || [])
					.is('archived', false)
					.eq('status', 'complete')
					.then(async items => {
						const temp = items?.data as any

						// Map display_name from allusers onto gifted_items based on gifter_id
						if (temp) {
							temp.forEach((item: any) => {
								if (item.gifted_items) {
									item.gifted_items.forEach((gift: any) => {
										const gifter = allusers?.find((user: any) => user.user_id === gift.gifter_id)
										gift.gifter_display_name = gifter?.display_name || 'Unknown'
									})
								}
							})
						}

						return {
							data: temp,
						}
					})

				console.log('items', items)

				if (!items) return { id: user.user_id, ok: false, error: 'Error fetching items or no items found' }

				const formattedItems =
					items.data?.map((item: any) => ({
						title: item.title,
						image_url: item.image_url,
						gifters: item.gifted_items?.map((gift: any) => gift.gifter_display_name) || [],
					})) || []

				console.log('formattedItems', { user, formattedItems, recipient })

				if (formattedItems.length === 0) {
					console.log('🔴 no items found', { user, formattedItems, recipient })
					return { id: user.user_id, ok: false, error: 'No items found' }
				}

				await resendClient.emails.send(
					{
						...commonEmailProps(),
						to: recipient,
						subject: 'A look back at your birthday 👀',
						react: PostBirthdayEmail({ name: user.display_name || 'user-with-no-name', items: formattedItems }),
					},
					{
						idempotencyKey: `post-birthday-email/${now.getFullYear()}/${user.user_id}`,
					}
				)

				const updates = await supabase
					.from('list_items')
					.update([{ archived: true }])
					.in('id', items.data?.map((item: any) => item.id) || [])

				return { id: user.user_id, ok: true, formattedItems, items: items.data, lists: lists.data, updates }
			} catch (e: any) {
				console.log('🔴 daily cron error', e)
				return { id: user.user_id, ok: false, error: e?.message }
			}
		})
	)

	return NextResponse.json({ sent: results.filter(r => r.ok).length, results })
}
