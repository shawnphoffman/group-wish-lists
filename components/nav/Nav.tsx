import Link from 'next/link'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'

import { isDeployed } from '@/utils/environment'

export default function Nav() {
	return (
		<div className="flex gap-2">
			<Link href="/" className={'nav-btn gray'}>
				<FontAwesomeIcon className="fa-sharp fa-solid fa-list-check" />
				<span className="hidden xs:inline">Wish Lists</span>
				<span className="inline xs:hidden">Lists</span>
			</Link>
			<Link href="/me" className={'nav-btn gray'}>
				<FontAwesomeIcon className="fa-sharp fa-solid fa-user" />
				<span className="hidden xs:inline">My Stuff</span>
				<span className="inline xs:hidden">Me</span>
			</Link>
			{!isDeployed && (
				<Link href="/temp" className={'nav-btn yellow'}>
					<FontAwesomeIcon className="fa-sharp fa-solid fa-flask" />
				</Link>
			)}
			{!isDeployed && (
				<Link href="/markdown" className={'nav-btn yellow'}>
					<FontAwesomeIcon className="fa-brands fa-markdown" />
				</Link>
			)}
		</div>
	)
}
