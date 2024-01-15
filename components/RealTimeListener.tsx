'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { isDeployed } from '@/utils/environment'
import { createClientSideClient } from '@/utils/supabase/client'

import { List } from './lists/types'

type Props = {
	listId?: List['id']
}

const EventTypes = {
	INSERT: 'INSERT',
	UPDATE: 'UPDATE',
	DELETE: 'DELETE',
} as const

const getMessage = (payload: { eventType: keyof typeof EventTypes; new: { id: any }; old: { id: any } }) => {
	switch (payload.eventType) {
		case EventTypes.INSERT:
			return `(INSERT: ${payload.new.id})`
		case EventTypes.UPDATE:
			return `(UPDATE: ${payload.new.id})`
		case EventTypes.DELETE:
			return `(DELETE: ${payload.old.id})`
		default:
			return 'Unknown event type'
	}
}

export default function RealTimeListener({ listId }: Props) {
	const [updates, setUpdates] = useState<string[]>([])
	const supabase = createClientSideClient()
	const router = useRouter()

	useEffect(() => {
		const channels = supabase
			.channel('list_items')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'list_items', filter: `list_id=eq.${listId}` }, payload => {
				console.log('Change received!', payload)

				// TODO
				// router.refresh()

				setUpdates(updates => [
					...updates,
					// @ts-ignore
					getMessage(payload),
				])
			})
			.subscribe()

		return () => {
			channels.unsubscribe()
		}
	}, [])

	if (isDeployed) return null

	return <div>REAL-TIME: {updates.join(', ')}</div>
}
