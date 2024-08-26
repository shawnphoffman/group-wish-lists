import Badge from '../common/Badge'
import { List } from '../types'

import { getSessionUser } from '@/app/actions/auth'
import { getListsGroupedByUser } from '@/app/actions/lists'
import ErrorMessage from '@/components/common/ErrorMessage'
import ListBlock from '@/components/lists/ListBlock'

const daysUntilBirthday = (month: string, day: number) => {
	const months: { [key: string]: number } = {
		january: 0,
		february: 1,
		march: 2,
		april: 3,
		may: 4,
		june: 5,
		july: 6,
		august: 7,
		september: 8,
		october: 9,
		november: 10,
		december: 11,
	} as const

	const today = new Date()
	const currentYear = today.getFullYear()

	// Get the birth month and day
	const birthMonth = months[month.toLowerCase()]
	const birthDay = day

	// Create a date object for this year's birthday
	let nextBirthday = new Date(currentYear, birthMonth, birthDay)

	// If this year's birthday has already passed, set to next year
	if (nextBirthday < today) {
		nextBirthday.setFullYear(currentYear + 1)
	}

	// Calculate the difference in time and convert to days
	const timeDifference = Number(nextBirthday) - Number(today)
	const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

	return daysDifference
}

const birthday = (month: string, day: number) => {
	return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}`
}

export default async function ListsByUser() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	const userPromise = getSessionUser()
	const listsPromise = getListsGroupedByUser()

	const [currentUser, { data: groupedLists, error }] = await Promise.all([
		userPromise,
		listsPromise,
		// fakePromise
	])

	return (
		<div className="container px-4 mx-auto">
			<div className="flex flex-col gap-4">
				{error && <ErrorMessage />}

				{groupedLists?.map(group => {
					const countdown = daysUntilBirthday(group.birth_month, group.birth_day)
					const plural = new Intl.PluralRules().select(countdown)
					return (
						<div key={`group-${group.id}`} className={`flex flex-col gap-1`}>
							{/* <h2 className="mb-2 text-2xl dark:text-white">{group.display_name}</h2> */}
							<div className="flex flex-row items-center gap-1">
								<Badge className="!text-base" colorId={group.id}>
									{group.display_name}
								</Badge>
								<Badge className="!text-xs gray">
									{/*  */}
									{birthday(group.birth_month, group.birth_day)}
								</Badge>
								{countdown < 31 && (
									<Badge className="!text-base" colorId={group.id}>
										{/*  */}
										{countdown} {plural === 'one' ? 'day' : 'days'}
									</Badge>
								)}
							</div>
							<ListBlock lists={group.lists as List[]} isOwner={currentUser?.id === group.user_id} />
						</div>
					)
				})}
			</div>
		</div>
	)
}
