'use client'

// TODO CHANGE THIS STUPID PATTERN

import { LoadingIcon } from '@/components/icons/Icons'
import ImportUrlClient from '@/components/imports/ImportUrlClient'
import { useCachedLists } from '@/hooks/useCachedLists'

export default function ImportItemClient() {
	const { lists, loading } = useCachedLists()
	const list = lists.find(l => l.primary) ?? lists[0]

	if (loading) {
		return <LoadingIcon className="!border-0" />
	}

	return <ImportUrlClient lists={lists} list={list} />
}
