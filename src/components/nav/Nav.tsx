import Link from 'next/link'

import FontAwesomeIcon from '@/components/icons/FontAwesomeIcon'
import { isDeployed } from '@/utils/environment'

export default function Nav() {
	return (
		<div className="flex gap-0">
			<Link href="/" className={'nav-btn gray max-xs:!px-2'}>
				<FontAwesomeIcon className="fa-sharp fa-solid fa-list-check" />
				<span className="hidden xs:inline text-nowrap">Wish Lists</span>
				<span className="inline xs:hidden">Lists</span>
			</Link>
			<Link href="/me" className={'nav-btn gray max-xs:!px-2'}>
				<FontAwesomeIcon className="fa-sharp fa-solid fa-user" />
				<span className="hidden xs:inline text-nowrap">My Stuff</span>
				<span className="inline xs:hidden">Me</span>
			</Link>
			<Link href="/faq" className={'nav-btn blue max-xs:!px-2'} title="FAQ">
				<FontAwesomeIcon className="fa-sharp fa-solid fa-question-circle xs:!text-2xl" />
			</Link>
			{!isDeployed && (
				<>
					<Link href="/temp" className={'nav-btn yellow hidden sm:flex'} title="Temp">
						<FontAwesomeIcon className="fa-sharp fa-solid fa-flask" />
					</Link>
					<Link href="/admin" className={'nav-btn red hidden sm:flex'} title="Admin">
						<FontAwesomeIcon className=" fa-sharp fa-solid fa-lock-keyhole" />
					</Link>
					<Link href="/admin/invite" className={'nav-btn red hidden sm:flex'} title="Invite">
						<FontAwesomeIcon className=" fa-sharp fa-solid fa-envelope" />
					</Link>
				</>
			)}
		</div>
	)
}
