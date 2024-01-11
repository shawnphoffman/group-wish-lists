import Link from 'next/link'

import MobileNav from './MobileNav'

const buttonClasses =
	'py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'

export default function Nav() {
	return (
		<>
			<div className="hidden gap-2 md:flex">
				<Link href="/" className={buttonClasses}>
					<i className="fa-sharp fa-solid fa-list-check" aria-hidden="true"></i>
					Wish Lists
				</Link>
				<Link href="/profile" className={buttonClasses}>
					<i className="fa-sharp fa-solid fa-user" aria-hidden="true"></i>
					Profile
				</Link>
			</div>
			<MobileNav />
		</>
	)
}
