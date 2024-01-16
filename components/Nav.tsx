import Link from 'next/link'

import FontAwesomeIcon from './icons/FontAwesomeIcon'

// import MobileNav from './MobileNav'

export default function Nav() {
	return (
		<>
			{/* <div className="hidden gap-2 xs:flex"> */}
			<div className="flex gap-2">
				<Link href="/" className={'nav-btn gray'}>
					<FontAwesomeIcon className="fa-sharp fa-solid fa-list-check" />
					Wish Lists
				</Link>
				<Link href="/me" className={'nav-btn gray'}>
					<FontAwesomeIcon className="fa-sharp fa-solid fa-user" />
					My Stuff
				</Link>
			</div>
			{/* <MobileNav /> */}
		</>
	)
}
