'use client'

import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment } from 'react'

import FontAwesomeIcon from './icons/FontAwesomeIcon'

export default function MobileNav() {
	return (
		<Menu as="div" className="relative inline-block text-right xs:hidden">
			<Menu.Button className="nav-btn gray">
				<FontAwesomeIcon className="fa-sharp fa-solid fa-link" />
				Links
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
				<Menu.Items className="absolute left-0 z-50 w-56 px-1 py-1 mt-2 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none">
					<Menu.Item>
						{({ active }) => (
							<Link className={`${active && 'active'} nav-item`} href="/">
								Wish Lists
							</Link>
						)}
					</Menu.Item>
					<Menu.Item>
						{({ active }) => (
							<Link className={`${active && 'active'} nav-item`} href="/profile">
								Profile
							</Link>
						)}
					</Menu.Item>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}
