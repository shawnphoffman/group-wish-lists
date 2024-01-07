'use client'

// import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

const inputClasses = `px-4 py-2 block w-full border border-gray-200 rounded-lg text-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 autoFocus`

// import { archiveList, renameList } from '@/app/actions/lists'

export default function RenameListButton({ listId, name }: any) {
	// const router = useRouter()
	// const pathname = usePathname()
	const [isEditing, setIsEditing] = useState(false)
	const [isPending, startTransition] = useTransition()

	const handleClick = useCallback(async () => {
		// console.log('RENAME LIST', { listId, name })
		setIsEditing(() => !isEditing)
	}, [isEditing])

	const handleChange = useCallback(async () => {
		console.log('RENAME LIST', { listId, name })
		setIsEditing(() => !isEditing)
	}, [isEditing, listId, name])

	// const handleClick = useCallback(async () => {
	// 	const resp = await renameList(listId, 'New Name')
	// 	if (resp?.status === 'success') {
	// 		console.log('rename success', { resp, listId })
	// 		if (pathname === '/') {
	// 			startTransition(() => {
	// 				router.refresh()
	// 			})
	// 		}
	// 	} else {
	// 		console.log('rename error', { resp, listId })
	// 	}
	// }, [listId])

	return (
		<>
			{isEditing ? (
				<>
					<input className={inputClasses} type="text" defaultValue={name} name="list-name" autoFocus />
					<button type="button" title="Save" onClick={handleChange} disabled={isPending}>
						<i className="fa-sharp fa-solid fa-check text-2xl text-green-300 hover:text-green-400" aria-hidden />
					</button>
					<button type="button" title="Cancel" onClick={handleClick} disabled={isPending}>
						<i className="fa-sharp fa-solid fa-xmark text-2xl text-red-300 hover:text-red-400" aria-hidden />
					</button>
				</>
			) : (
				<>
					<h1 className="">Edit - {name}</h1>
					<button type="button" title="Rename" onClick={handleClick} disabled={isPending}>
						<i className="fa-sharp fa-solid fa-pencil text-2xl text-yellow-200 hover:text-yellow-300" aria-hidden />
					</button>
				</>
			)}
		</>
	)
}
