'use client'

import { useEffect, useState } from 'react'

import { getMyLists } from '@/app/actions/lists'
import { List } from '@/components/types'
import { ListType } from '@/components/me/MyLists'

export const useCachedLists = (type = 'all') => {
	const [lists, setLists] = useState<
		(List & { listType: 'public' | 'private' | 'gift_ideas' | 'shared_with_me' | 'shared_with_others' })[]
	>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let mounted = true

		const fetchLists = async () => {
			try {
				setLoading(true)
				setError(null)

				const [
					{ data: publicLists },
					{ data: privateLists },
					{ data: giftIdeasList },
					{ data: sharedWithMeLists },
					{ data: sharedWithOthersLists },
				] = await Promise.all([
					getMyLists(ListType.PUBLIC),
					getMyLists(ListType.PRIVATE),
					getMyLists(ListType.GIFT_IDEAS),
					getMyLists(ListType.SHARED_WITH_ME),
					getMyLists(ListType.SHARED_WITH_OTHERS),
				])

				if (mounted) {
					// TODO Change this stupid pattern
					const allLists = [
						...(publicLists ? publicLists.map(l => ({ ...l, listType: 'public' })) : []),
						...(privateLists ? privateLists.map(l => ({ ...l, listType: 'private' })) : []),
						...(giftIdeasList ? giftIdeasList.map(l => ({ ...l, listType: 'gift_ideas' })) : []),
						...(sharedWithMeLists ? sharedWithMeLists.map(l => ({ ...l, listType: 'shared_with_me' })) : []),
						...(sharedWithOthersLists ? sharedWithOthersLists.map(l => ({ ...l, listType: 'shared_with_others' })) : []),
					]

					setLists(allLists)
					setLoading(false)
				}
			} catch (err) {
				if (mounted) {
					setError(err instanceof Error ? err.message : 'Failed to fetch lists')
					setLoading(false)
				}
			}
		}

		fetchLists()

		return () => {
			mounted = false
		}
	}, [type])

	return { lists, loading, error }
}
