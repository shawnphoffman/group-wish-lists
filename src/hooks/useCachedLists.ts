'use client'

import { useEffect, useState } from 'react'

import { getMyLists } from '@/app/actions/lists'
import { List } from '@/components/types'

export const useCachedLists = (type = 'all') => {
	const [lists, setLists] = useState<List[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let mounted = true

		const fetchLists = async () => {
			try {
				setLoading(true)
				setError(null)

				// Fetch both my lists and shared lists for MyListsSelect
				const [{ data: myLists }, { data: sharedLists }] = await Promise.all([getMyLists(), getMyLists('shared_with_me')])

				if (mounted) {
					// TODO Change this stupid pattern
					const allLists = [
						//
						...(myLists ? myLists.map(l => ({ ...l, _my_list: true })) : []),
						//
						...(sharedLists ? sharedLists.map(l => ({ ...l, _shared_with_me: true })) : []),
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
