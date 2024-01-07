'use client'

import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment } from 'react'

const buttonClasses =
	'py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'

const itemClasses = 'group flex w-full items-center rounded-md px-2 py-2 text-sm'

export default function Nav() {
	return (
		<>
			<div className="hidden md:flex gap-2">
				<Link href="/" className={buttonClasses}>
					Lists
				</Link>
				<Link href="/profile" className={buttonClasses}>
					Profile
				</Link>
			</div>
			<Menu as="div" className="relative inline-block text-right md:hidden">
				<Menu.Button className={buttonClasses}>
					<i className="fa-sharp fa-solid fa-link"></i>Links
				</Menu.Button>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left z-50 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<a className={`${active ? 'bg-red-500 text-white' : 'text-gray-900'} ${itemClasses}`} href="/">
									Lists
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a className={`${active ? 'bg-red-500 text-white' : 'text-gray-900'} ${itemClasses}`} href="/profile">
									Profile
								</a>
							)}
						</Menu.Item>
					</Menu.Items>
				</Transition>
			</Menu>
		</>
	)
}
