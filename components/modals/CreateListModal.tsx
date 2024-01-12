'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
// @ts-expect-error
import { useFormState } from 'react-dom'

import { createList } from '@/app/actions/lists'

import { isDeployed } from '@/utils/environment'

import FontAwesomeIcon from '../icons/FontAwesomeIcon'

export default function CreateListModal() {
	const [state, formAction] = useFormState(createList, {})
	const router = useRouter()
	const pathname = usePathname()
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (state?.status === 'success') {
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
				<div className="m-3 mt-0 transition-all ease-out opacity-0 hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 sm:max-w-lg sm:w-full sm:mx-auto">
					<div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
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
									Title
								</label>
								<input type="text" id="input-name" name="list-name" className="input" placeholder="Your Cool List" autoFocus />
							</div>
							<div>
								<label className="block mb-1 label">Type</label>
								<div className="flex flex-col ml-2 gap-y-1">
									<div className="flex items-center">
										<input className="radio" type="radio" name="list-type" value="christmas" id="christmas" defaultChecked={true} />
										<label className="label" htmlFor="christmas">
											Christmas
										</label>
									</div>
									<div className="flex">
										<input className="radio" type="radio" name="list-type" value="birthday" id="birthday" />
										<label className="label" htmlFor="christmas">
											Birthday
										</label>
									</div>
									<div className="flex">
										<input className="radio" type="radio" name="list-type" value="wishlist" id="wishlist" />
										<label className="label" htmlFor="wishlist">
											Wish List
										</label>
									</div>
									{!isDeployed && (
										<div className="flex">
											<input className="radio" type="radio" name="list-type" value="test" id="test" />
											<label className="label" htmlFor="test">
												Test
											</label>
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="flex items-center justify-end px-4 py-3 border-t gap-x-2 dark:border-gray-700">
							<button
								type="button"
								className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-lg shadow-sm gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
								data-hs-overlay="#hs-create-list-modal"
							>
								Cancel
							</button>
							<button className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-blue-600 border border-transparent rounded-lg gap-x-2 hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
								Create List
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	)
}
