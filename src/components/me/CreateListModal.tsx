'use client'

import './CreateListModal.css'

import { startTransition, useEffect, useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { faXmark } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RadioGroup } from '@headlessui/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { createList } from '@/app/actions/lists'
import ListTypeIcon from '@/components/icons/ListTypeIcon'
import { ListCategory, ListPrivacy } from '@/utils/enums'

function CreateListFields() {
	const { pending } = useFormStatus()

	return (
		<fieldset disabled={pending} className="create-list-modal">
			<div className="header">
				<h3>New List</h3>
				<Link href="/me">
					<FontAwesomeIcon icon={faXmark} />
				</Link>
			</div>
			<div className="form">
				<div>
					<label htmlFor="input-name" className="block mb-2 label">
						List Title
					</label>
					<input type="text" id="input-name" name="list-name" placeholder="Your Cool List" autoFocus required />
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
													{key.replace(/(?<!^)([A-Z])/g, ' $1')}
												</label>
											)}
										</RadioGroup.Option>
									)
							)}
						</div>
					</RadioGroup>
				</div>
			</div>
			<div className="footer">
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
		<div className="backdrop">
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
