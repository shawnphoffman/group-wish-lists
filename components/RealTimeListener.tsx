'use client'

import { useRouter } from 'next/navigation'
import {
	useEffect,
	/*, useState*/
	useTransition,
} from 'react'
import { toast } from 'react-toastify'

// import { isDeployed } from '@/utils/environment'
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

// type UpdatePayloadType = {
// 	eventType: keyof typeof EventTypes
// 	new: { id: any }
// 	old: { id: any }
// }

// const getMessage = (payload: UpdatePayloadType) => {
// 	switch (payload.eventType) {
// 		case EventTypes.INSERT:
// 			return `(INSERT: ${payload.new.id})`
// 		case EventTypes.UPDATE:
// 			return `(UPDATE: ${payload.new.id})`
// 		case EventTypes.DELETE:
// 			return `(DELETE: ${payload.old.id})`
// 		default:
// 			return 'Unknown event type'
// 	}
// }

export default function RealTimeListener({ listId }: Props) {
	// const [updates, setUpdates] = useState<string[]>([])
	const supabase = createClientSideClient()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	useEffect(() => {
		console.log('UE', listId)
		const channels = supabase
			.channel('list_items')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'list_items', filter: `list_id=eq.${listId}` }, payload => {
				toast.success('List updated!')
				// setUpdates(updates => [...updates, getMessage(payload as unknown as UpdatePayloadType)])
				startTransition(() => {
					router.refresh()
				})
			})
			.subscribe(console.log)

		return () => {
			channels.unsubscribe()
		}
	}, [])

	return null

	// if (isDeployed) return null

	// return <div>REAL-TIME: {updates.join(', ')}</div>
}
