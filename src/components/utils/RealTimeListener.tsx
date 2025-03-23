'use client'

import { startTransition, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { List } from '@/components/types'
import { createClientSideClient } from '@/utils/supabase/client'

type Props = {
	listId?: List['id']
}

export default function RealTimeListener({ listId }: Props) {
	const supabase = createClientSideClient()
	const router = useRouter()
	const isSubscribed = useRef(false)

	console.log('RealTimeListener', { listId })

	useEffect(() => {
		const filters = listId ? { filter: `list_id=eq.${listId}` } : {}
		const channels = supabase
			.channel('list_items')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'list_items', ...filters }, payload => {
				console.log('RealTime Event', payload)
				startTransition(() => {
					router.refresh()
				})
			})
			.subscribe(status => {
				console.log({ status })
				isSubscribed.current = status === 'SUBSCRIBED'
			})

		return () => {
			if (isSubscribed.current) {
				console.log('UNSUBSCRIBING')
				channels.unsubscribe()
			} else {
				console.log('NOT UNSUBSCRIBING')
			}
		}
	}, [listId, router, supabase])

	return null
}
