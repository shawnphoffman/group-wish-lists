'use client'

import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function Nav() {
	return (
		<Menu as="div" className="relative inline-block text-right">
			<Menu.Button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">Links</Menu.Button>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left z-50 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
					<div className="px-1 py-1 ">
						<Menu.Item>
							{({ active }) => (
								<a
									className={`${
										active ? 'bg-red-500 text-white' : 'text-gray-900'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
									href="/"
								>
									Lists
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									className={`${
										active ? 'bg-red-500 text-white' : 'text-gray-900'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
									href="/profile"
								>
									Profile
								</a>
							)}
						</Menu.Item>
						{/* <Menu.Item>
							{({ active }) => (
								<button
									className={`${
										active ? 'bg-red-500 text-white' : 'text-gray-900'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
								>
									Duplicate
								</button>
							)}
						</Menu.Item> */}
					</div>
					{/* <div className="px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<button
									className={`${
										active ? 'bg-red-500 text-white' : 'text-gray-900'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
								>
									Archive
								</button>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<button
									className={`${
										active ? 'bg-red-500 text-white' : 'text-gray-900'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
								>
									Move
								</button>
							)}
						</Menu.Item>
					</div> */}
					{/* <div className="px-1 py-1">
						<Menu.Item>
							{({ active }) => (
								<button
									className={`${
										active ? 'bg-red-500 text-white' : 'text-gray-900'
									} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
								>
									Delete
								</button>
							)}
						</Menu.Item>
					</div> */}
				</Menu.Items>
			</Transition>
		</Menu>
	)
}
