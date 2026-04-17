'use client'

import { startTransition, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { List } from '@/components/types'
import { createClientSideClient } from '@/utils/supabase/client'

type Props = {
	listId?: List['id']
}

export default function RealTimeListener({ listId }: Props) {
	const supabase = useMemo(() => createClientSideClient(), [])
	const router = useRouter()

	useEffect(() => {
		const filters = listId ? { filter: `list_id=eq.${listId}` } : {}
		// Unique topic per mount so effect re-runs / StrictMode double-mounts
		// don't collide with an existing channel in the client registry
		// (supabase-js >=2.100 throws when `.on()` is called on a channel that
		// already subscribed).
		const topic = `list_items:${listId ?? 'all'}:${Math.random().toString(36).slice(2)}`
		const channel = supabase
			.channel(topic)
			.on('postgres_changes', { event: '*', schema: 'public', table: 'list_items', ...filters }, () => {
				startTransition(() => {
					router.refresh()
				})
			})
			.subscribe()

		return () => {
			// Safe at any lifecycle state; also removes the channel from the
			// client's internal registry so we don't leak topics.
			supabase.removeChannel(channel)
		}
	}, [listId, router, supabase])

	return null
}
