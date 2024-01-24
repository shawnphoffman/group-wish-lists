'use client'

import { RadioGroup } from '@headlessui/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { startTransition, useEffect, useRef } from 'react'
// @ts-expect-error
import { useFormState, useFormStatus } from 'react-dom'

import { createList } from '@/app/actions/lists'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import ListTypeIcon from '@/components/icons/ListTypeIcon'

import { ListCategory, ListPrivacy } from '@/utils/enums'

// TODO Refactor Styles

function CreateListFields() {
	const { pending } = useFormStatus()

	return (
		<fieldset disabled={pending} className="flex flex-col bg-gray-800 border border-gray-700 shadow-2xl pointer-events-auto rounded-xl ">
			<div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
				<h3 className="text-xl font-bold text-gray-800 dark:text-white">Create a List</h3>
				<Link
					href="/me"
					className="flex items-center justify-center text-sm font-semibold text-gray-800 border border-transparent rounded-full w-7 h-7 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
				>
					<span className="sr-only">Close</span>
					<FontAwesomeIcon className="fa-sharp fa-solid fa-xmark" />
				</Link>
			</div>
			<div className="flex flex-col gap-4 p-4 overflow-y-auto">
				<div>
					<label htmlFor="input-name" className="block mb-2 label">
						List Title
					</label>
					<input type="text" id="input-name" name="list-name" placeholder="Your Cool List" autoFocus />
				</div>
				<div>
					<RadioGroup name="list-privacy" defaultValue={ListPrivacy.Public}>
						<RadioGroup.Label className="block mb-1 label">Privacy</RadioGroup.Label>
						<div className="flex flex-col gap-1 sm:gap-2 sm:flex-row">
							{/* TODO refactor */}
							<RadioGroup.Option value={ListPrivacy.Public} key={'Public'}>
								{({ checked }) => (
									<label
										className={`btn text-base mt-0 mb-1 flex-1 w-full ${checked ? ' teal ring-1 ring-white' : 'transparent'}`}
										htmlFor={'Public'}
									>
										Public
									</label>
								)}
							</RadioGroup.Option>
							<RadioGroup.Option value={ListPrivacy.Private} key={'Private'}>
								{({ checked }) => (
									<label
										className={`btn text-base mt-0 mb-1 flex-1 w-full ${checked ? ' teal ring-1 ring-white' : 'transparent'}`}
										htmlFor={'Private'}
									>
										Private
									</label>
								)}
							</RadioGroup.Option>
						</div>
					</RadioGroup>
				</div>
				<div>
					<RadioGroup name="list-type" defaultValue={ListCategory.Christmas}>
						<RadioGroup.Label className="block mb-1 label">List Type</RadioGroup.Label>
						<div className="flex flex-col flex-wrap gap-1 sm:gap-2 sm:flex-row">
							{Object.entries(ListCategory).map(
								([key, value], i) =>
									value !== 'test' && (
										<RadioGroup.Option value={value} key={key}>
											{({ checked }) => (
												<label
													className={`btn text-base mt-0 mb-1 flex-1 w-full ${checked ? ' teal ring-1 ring-white' : 'transparent'}`}
													htmlFor={value}
												>
													<ListTypeIcon type={value} />
													{key}
												</label>
											)}
										</RadioGroup.Option>
									)
							)}
						</div>
					</RadioGroup>
				</div>
			</div>
			<div className="flex items-center justify-end px-4 py-3 border-t gap-x-2 dark:border-gray-700">
				<Link href="/me" className="btn gray">
					Cancel
				</Link>
				<button className="btn green">{pending ? 'Creating...' : 'Create List'}</button>
			</div>
		</fieldset>
	)
}

export default function CreateListModal() {
	const [state, formAction] = useFormState(createList, {})
	const router = useRouter()
	const pathname = usePathname()
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (state?.status === 'success') {
			startTransition(() => {
				if (formRef?.current) {
					formRef.current.reset()
				}
				router.push('/me')
				router.refresh()
			})
		}
	}, [state, pathname, router])

	return (
		<div className="fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-900 bg-opacity-70">
			<form
				action={formAction}
				ref={formRef}
				className="z-[80] overflow-x-hidden overflow-y-auto pointer-events-none transition-all ease-out"
			>
				<CreateListFields />
			</form>
		</div>
	)
}
