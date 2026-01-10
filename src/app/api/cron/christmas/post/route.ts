import { NextResponse } from 'next/server'
import React from 'react'

import PostChristmasEmail from '@/emails/post-christmas-email'
import { resendClient, commonEmailProps, getBccAddress } from '@/utils/resend'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(req: Request) {
	// Verify secret to prevent abuse
	const auth = req.headers.get('authorization')
	if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
		return new NextResponse('Unauthorized', { status: 401 })
	}

	const supabase = createAdminClient()

	const now = new Date()

	// Get all users with partner information
	const { data: allUsers, error: usersError } = await supabase.from('users').select('user_id,display_name,partner_user_id')

	if (usersError) return NextResponse.json({ error: usersError.message }, { status: 500 })
	if (!allUsers?.length) return NextResponse.json({ sent: 0, message: 'No users found' })

	// Collect all email payloads first
	const emailPayloads: Array<{
		from: string
		to: string
		subject: string
		react: React.ReactElement
	}> = []
	const userResults: Array<{
		id: string
		ok: boolean
		error?: string
		recipient?: string
		itemsData?: any[]
		addonsData?: any[]
	}> = []

	// Process all users and prepare email payloads
	await Promise.all(
		allUsers.map(async (user: any) => {
			console.log('user', user)

			try {
				const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(user.user_id)
				if (userErr) {
					userResults.push({ id: user.user_id, ok: false, error: userErr.message })
					return
				}
				const recipient = userData?.user?.email
				if (!recipient) {
					userResults.push({ id: user.user_id, ok: false, error: 'No email for user' })
					return
				}

				// Get Christmas lists for this user
				const lists = await supabase
					.from('lists')
					.select('id')
					.eq('recipient_user_id', user.user_id)
					.eq('active', true)
					.eq('private', false)
				// TODO
				// .eq('type', ListCategory.Christmas)

				const listIds = lists.data?.map((list: any) => list.id) || []

				// Get items and addons in parallel
				const [itemsResponse, addonsResponse] = await Promise.all([
					supabase
						.from('list_items')
						.select('*,gifted_items(*,gifter_id)')
						.in('list_id', listIds)
						.is('archived', false)
						.eq('status', 'complete'),
					supabase
						.from('list_addons')
						.select('id,description,total_cost,notes,user:user_id(user_id, display_name)')
						.in('list_id', listIds)
						.is('archived', false),
				])

				if (itemsResponse.error) {
					userResults.push({ id: user.user_id, ok: false, error: `Error fetching items: ${itemsResponse.error.message}` })
					return
				}
				if (addonsResponse.error) {
					userResults.push({ id: user.user_id, ok: false, error: `Error fetching addons: ${addonsResponse.error.message}` })
					return
				}

				// Process items to add display names
				const temp = itemsResponse.data as any
				if (temp) {
					temp.forEach((item: any) => {
						if (item.gifted_items) {
							item.gifted_items.forEach((gift: any) => {
								const gifter = allUsers?.find((u: any) => u.user_id === gift.gifter_id)
								gift.gifter_display_name = gifter?.display_name || 'Unknown'
							})
						}
					})
				}

				const itemsResult = { data: temp }
				const addonsResult = addonsResponse

				console.log('items', itemsResult)
				console.log('addons', addonsResult)

				const formattedItems =
					itemsResult.data?.map((item: any) => {
						// Collect all unique gifters for this item, including partners
						const gifterNames = new Set<string>()

						if (item.gifted_items) {
							item.gifted_items.forEach((gift: any) => {
								const gifter = allUsers?.find((u: any) => u.user_id === gift.gifter_id)
								if (gifter) {
									gifterNames.add(gifter.display_name)

									// Add gifter's partner if they have one and recipient is not the partner
									if (gifter.partner_user_id && gifter.partner_user_id !== user.user_id) {
										const partner = allUsers?.find((u: any) => u.user_id === gifter.partner_user_id)
										if (partner) {
											gifterNames.add(partner.display_name)
										}
									}
								}
							})
						}

						return {
							title: item.title,
							image_url: item.image_url,
							gifters: Array.from(gifterNames),
						}
					}) || []

				const formattedAddons =
					addonsResult.data?.map((addon: any) => {
						const gifterUserId = addon.user?.user_id
						const gifter = allUsers?.find((u: any) => u.user_id === gifterUserId)
						const gifterDisplayName = gifter?.display_name || 'Unknown'

						// Get gifter's partner if they have one and recipient is not the partner
						let gifters = [gifterDisplayName]
						if (gifter?.partner_user_id && gifter.partner_user_id !== user.user_id) {
							const partner = allUsers?.find((u: any) => u.user_id === gifter.partner_user_id)
							if (partner) {
								gifters.push(partner.display_name)
							}
						}

						return {
							description: addon.description,
							gifters: gifters,
						}
					}) || []

				console.log('formattedItems', { user, formattedItems, formattedAddons, recipient })

				// Only send email if there are items OR addons
				if (formattedItems.length === 0 && formattedAddons.length === 0) {
					console.log('🔴 no items or addons found', { user, formattedItems, formattedAddons, recipient })
					userResults.push({ id: user.user_id, ok: false, error: 'No items or addons found', recipient })
					return
				}

				emailPayloads.push({
					...commonEmailProps(), // Include BCC
					to: recipient,
					subject: `A look back at your Christmas gifts 🎄`,
					react: PostChristmasEmail({
						name: user.display_name || 'user-with-no-name',
						items: formattedItems,
						addons: formattedAddons,
					}),
				})

				userResults.push({
					id: user.user_id,
					ok: true,
					recipient,
					itemsData: itemsResult.data,
					addonsData: addonsResult.data,
				})
			} catch (e: any) {
				console.log('🔴 post-christmas cron error', e)
				userResults.push({ id: user.user_id, ok: false, error: e?.message })
			}
		})
	)

	// Send all emails in batch
	const MAX_BATCH_SIZE = 100 // Resend batch API supports up to 100 emails per request
	const results: Array<{ id: string; ok: boolean; error?: string }> = []

	for (let i = 0; i < emailPayloads.length; i += MAX_BATCH_SIZE) {
		const batch = emailPayloads.slice(i, i + MAX_BATCH_SIZE)
		const batchUserResults = userResults.filter(r => r.ok).slice(i, i + MAX_BATCH_SIZE)

		console.log(
			`Sending batch ${Math.floor(i / MAX_BATCH_SIZE) + 1} of ${Math.ceil(emailPayloads.length / MAX_BATCH_SIZE)} (${batch.length} emails)`
		)

		try {
			const { data: batchData, error: batchError } = await resendClient.batch.send(batch)

			if (batchError) {
				// If entire batch fails, mark all as failed
				batchUserResults.forEach(userResult => {
					results.push({ id: userResult.id, ok: false, error: batchError.message })
				})
			} else if (batchData && Array.isArray(batchData)) {
				// Map successful email IDs back to user IDs and archive items/addons
				await Promise.all(
					batchUserResults.map(async (userResult, index) => {
						const emailResult = batchData[index]
						if (emailResult && 'id' in emailResult && emailResult.id) {
							// Archive items and addons for successful sends
							const itemUpdates = userResult.itemsData?.length
								? await supabase
										.from('list_items')
										.update([{ archived: true }])
										.in(
											'id',
											userResult.itemsData.map((item: any) => item.id)
										)
								: null

							const addonUpdates = userResult.addonsData?.length
								? await supabase
										.from('list_addons')
										.update([{ archived: true }])
										.in(
											'id',
											userResult.addonsData.map((addon: any) => addon.id)
										)
								: null

							results.push({ id: userResult.id, ok: true })
						} else {
							results.push({ id: userResult.id, ok: false, error: 'No email ID returned' })
						}
					})
				)
			}
		} catch (e: any) {
			// If batch throws an error, mark all as failed
			batchUserResults.forEach(userResult => {
				results.push({ id: userResult.id, ok: false, error: e?.message || 'Unknown error' })
			})
		}
	}

	// Add failed user results that didn't make it to email payloads
	userResults
		.filter(r => !r.ok)
		.forEach(result => {
			results.push({ id: result.id, ok: false, error: result.error })
		})

	return NextResponse.json({ sent: results.filter(r => r.ok).length, results })
}
