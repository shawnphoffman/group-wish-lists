'use client'
// import { Suspense } from 'react'

// TODO CHANGE THIS STUPID PATTERN

import { LoadingIcon } from '@/components/icons/Icons'
import ImportUrlClient from '@/components/imports/ImportUrlClient'
import { useCachedLists } from '@/hooks/useCachedLists'

export default function ImportItemClient() {
	const { lists, loading } = useCachedLists()
	const list = lists[0]

	if (loading) {
		return <LoadingIcon className="!border-0" />
	}

	return (
		// <Suspense>
		<ImportUrlClient lists={lists} list={list} />
		// </Suspense>
	)
}
