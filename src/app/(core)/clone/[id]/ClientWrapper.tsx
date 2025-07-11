'use client'

import { useEffect, useState } from 'react'

import { LoadingIcon } from '@/components/icons/Icons'
import { ListItem } from '@/components/types'
import { useCachedLists } from '@/hooks/useCachedLists'
import { createClientSideClient } from '@/utils/supabase/client'

import CloneItemForm from './CloneItemForm'

type Props = {
	itemId: string
}

export default function ClientWrapper({ itemId }: Props) {
	const { lists, loading: listsLoading } = useCachedLists()
	const [item, setItem] = useState<ListItem | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchItem() {
			try {
				const supabase = createClientSideClient()
				const { data, error } = await supabase.from('list_items').select('*').eq('id', itemId).single()

				if (error) {
					setError('Failed to fetch item')
					return
				}

				setItem(data)
			} catch (err) {
				setError('Failed to fetch item')
			} finally {
				setLoading(false)
			}
		}

		fetchItem()
	}, [itemId])

	if (listsLoading || loading) {
		return <LoadingIcon className="!border-0" />
	}

	if (error || !item) {
		return <div className="text-red-500">Error: {error || 'Item not found'}</div>
	}

	const list = lists.find(l => l.primary) ?? lists[0]

	return <CloneItemForm lists={lists} list={list} item={item} />
}
