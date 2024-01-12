import Link from 'next/link'

// import MobileNav from './MobileNav'

export default function Nav() {
	return (
		<>
			{/* <div className="hidden gap-2 xs:flex"> */}
			<div className="flex gap-2">
				<Link href="/" className={'nav-btn gray'}>
					<i className="fa-sharp fa-solid fa-list-check" aria-hidden="true"></i>
					Wish Lists
				</Link>
				<Link href="/profile" className={'nav-btn gray'}>
					<i className="fa-sharp fa-solid fa-user" aria-hidden="true"></i>
					Profile
				</Link>
			</div>
			{/* <MobileNav /> */}
		</>
	)
}
