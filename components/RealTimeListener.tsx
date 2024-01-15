'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'

// import { toast } from 'react-toastify'
// import { getSessionUser } from '@/app/actions/auth'
import { createClientSideClient } from '@/utils/supabase/client'

import { List, User } from './lists/types'

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
// 	new: { id: number; user_id: User['user_id'] }
// 	old: { id: number }
// }

export default function RealTimeListener({ listId }: Props) {
	// const [updates, setUpdates] = useState<string[]>([])
	const supabase = createClientSideClient()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	let isSubscribed = false

	// async function doSomething(payload_user_id: string) {
	// 	const user = await getSessionUser()
	// 	if (payload_user_id !== user?.id) {
	// 		console.log('DOING SOMETHING', { payload_user_id, user_id: user?.id })
	// 		toast.success('List updated!')
	// 		startTransition(() => {
	// 			router.refresh()
	// 		})
	// 	} else {
	// 		console.log('NOT DOING ANYTHING')
	// 	}
	// }

	useEffect(() => {
		console.log('UE', listId)
		const channels = supabase
			.channel('list_items')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'list_items', filter: `list_id=eq.${listId}` }, payload => {
				console.log('RealTime Event', payload)
				startTransition(() => {
					router.refresh()
				})
				// const event = payload as unknown as UpdatePayloadType
				// if (event.eventType === EventTypes.INSERT || event.eventType === EventTypes.UPDATE) {
				// 	doSomething(event.new.user_id)
				// }
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
