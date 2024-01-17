'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useEffect } from 'react'

import { List } from '@/components/types'

import { createClientSideClient } from '@/utils/supabase/client'

type Props = {
	listId?: List['id']
}

export default function RealTimeListener({ listId }: Props) {
	const supabase = createClientSideClient()
	const router = useRouter()
	let isSubscribed = false

	useEffect(() => {
		const channels = supabase
			.channel('list_items')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'list_items', filter: `list_id=eq.${listId}` }, payload => {
				console.log('RealTime Event', payload)
				startTransition(() => {
					router.refresh()
				})
			})
			.subscribe(status => {
				console.log({ status })
				isSubscribed = status === 'SUBSCRIBED'
			})

		return () => {
			if (isSubscribed) {
				console.log('UNSUBSCRIBING')
				channels.unsubscribe()
			} else {
				console.log('NOT UNSUBSCRIBING')
			}
		}
	}, [listId])

	return null
}
