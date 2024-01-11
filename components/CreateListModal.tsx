'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { createList } from '@/app/actions/lists'

import { isDeployed } from '@/utils/environment'

import RadioLabel from './core/RadioLabel'

export default function CreateListModal() {
	const [state, formAction] = useFormState(createList, {})
	const router = useRouter()
	const pathname = usePathname()
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (state?.status === 'success') {
			// console.log('CLOSING MODAL')
			window?.HSOverlay?.close('#hs-create-list-modal')

			if (pathname === '/') {
				router.refresh()
			}

			if (formRef?.current) {
				formRef.current.reset()
			}
		}
	}, [state])

	return (
		<form action={formAction} ref={formRef}>
			<div
				id="hs-create-list-modal"
				className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
			>
				<div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
					<div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
						<div className="flex justify-between items-center py-3 px-4 border-b dark:border-gray-700">
							<h3 className="font-bold text-gray-800 dark:text-white text-xl">Create a List</h3>
							<button
								type="button"
								className="flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								data-hs-overlay="#hs-create-list-modal"
							>
								<span className="sr-only">Close</span>
								<i className="fa-sharp fa-solid fa-xmark" aria-hidden="true"></i>
							</button>
						</div>
						<div className="p-4 overflow-y-auto gap-4 flex flex-col">
							<div>
								<label htmlFor="input-name" className="label block mb-2">
									Title
								</label>
								<input type="text" id="input-name" name="list-name" className="input" placeholder="Your Cool List" autoFocus />
							</div>
							<div>
								<label className="label block mb-1">Type</label>
								<div className="flex flex-col gap-y-1 ml-2">
									<div className="flex items-center">
										<input className="radio" type="radio" name="list-type" value="christmas" id="christmas" defaultChecked={true} />
										<RadioLabel htmlFor="christmas">Christmas</RadioLabel>
									</div>
									<div className="flex">
										<input className="radio" type="radio" name="list-type" value="birthday" id="birthday" />
										<RadioLabel htmlFor="christmas">Birthday</RadioLabel>
									</div>
									<div className="flex">
										<input className="radio" type="radio" name="list-type" value="wishlist" id="wishlist" />
										<RadioLabel htmlFor="wishlist">Wish List</RadioLabel>
									</div>
									{!isDeployed && (
										<div className="flex">
											<input className="radio" type="radio" name="list-type" value="test" id="test" />
											<RadioLabel htmlFor="test">Test</RadioLabel>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-gray-700">
							<button
								type="button"
								className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								data-hs-overlay="#hs-create-list-modal"
							>
								Cancel
							</button>
							<button className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
								Create List
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	)
}
