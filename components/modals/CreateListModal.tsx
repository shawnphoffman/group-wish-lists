'use client'

import { RadioGroup } from '@headlessui/react'
import { usePathname, useRouter } from 'next/navigation'
import { startTransition, useEffect, useRef } from 'react'
// @ts-expect-error
import { useFormState, useFormStatus } from 'react-dom'

import { createList } from '@/app/actions/lists'

import { ListCategory } from '@/utils/enums'

// import { isDeployed } from '@/utils/environment'
import FontAwesomeIcon from '../icons/FontAwesomeIcon'
import TypeIcon from '../icons/TypeIcon'

function CreateListFields() {
	const { pending } = useFormStatus()

	return (
		<fieldset
			disabled={pending}
			className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]"
		>
			<div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
				<h3 className="text-xl font-bold text-gray-800 dark:text-white">Create a List</h3>
				<button
					type="button"
					className="flex items-center justify-center text-sm font-semibold text-gray-800 border border-transparent rounded-full w-7 h-7 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
					data-hs-overlay="#hs-create-list-modal"
				>
					<span className="sr-only">Close</span>
					<FontAwesomeIcon className="fa-sharp fa-solid fa-xmark" />
				</button>
			</div>
			<div className="flex flex-col gap-4 p-4 overflow-y-auto">
				<div>
					<label htmlFor="input-name" className="block mb-2 label">
						List Title
					</label>
					{/* @ts-expect-error */}
					<input type="text" id="input-name" name="list-name" className="input" placeholder="Your Cool List" autofocus="true" />
				</div>
				<div>
					<RadioGroup name="list-type" defaultValue={ListCategory.Christmas}>
						<RadioGroup.Label className="block mb-1 label">List Type</RadioGroup.Label>
						<div className="flex flex-col gap-1 sm:gap-2 sm:flex-row">
							{Object.entries(ListCategory).map(([key, value], i) => (
								<RadioGroup.Option value={value} key={key}>
									{({ checked }) => (
										<label className={`btn text-base mt-0 mb-1 flex-1 w-full ${checked ? ' teal' : 'transparent'}`} htmlFor={value}>
											<TypeIcon type={value} />
											{key}
										</label>
									)}
								</RadioGroup.Option>
							))}
						</div>
					</RadioGroup>
				</div>
			</div>
			<div className="flex items-center justify-end px-4 py-3 border-t gap-x-2 dark:border-gray-700">
				<button type="button" className="btn gray" data-hs-overlay="#hs-create-list-modal">
					Cancel
				</button>
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
			window?.HSOverlay?.close('#hs-create-list-modal')

			startTransition(() => {
				if (formRef?.current) {
					formRef.current.reset()
				}
				router.refresh()
			})
		}
	}, [state, pathname, router])

	return (
		<form
			action={formAction}
			ref={formRef}
			suppressHydrationWarning
			id="hs-create-list-modal"
			className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
		>
			<div className="m-3 mt-0 transition-all ease-out opacity-0 hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 sm:max-w-lg sm:w-full sm:mx-auto">
				<CreateListFields />
			</div>
		</form>
	)
}
