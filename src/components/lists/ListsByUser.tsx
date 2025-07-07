import { getSessionUser } from '@/app/actions/auth'
import { getListsGroupedByUser } from '@/app/actions/lists'
import ErrorMessage from '@/components/common/ErrorMessage'
import ListBlock from '@/components/lists/ListBlock'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { List } from '../types'

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
	const birthMonth = months[month?.toLowerCase()]
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
	if (!month || !day) return null

	return `${month.charAt(0).toUpperCase() + month.slice(1)} ${day}`
}

export default async function ListsByUser() {
	// const fakePromise = new Promise(resolve => setTimeout(resolve, 5000))
	// await new Promise(resolve => setTimeout(resolve, 10000))
	const userPromise = getSessionUser()
	const listsPromise = getListsGroupedByUser()

	const [currentUser, { data: groupedLists, error }] = await Promise.all([
		userPromise,
		listsPromise,
		// fakePromise
	])

	return (
		<div className="w-full">
			<div className="flex flex-col gap-2">
				{error && <ErrorMessage />}
				{groupedLists?.map(group => {
					const countdown = daysUntilBirthday(group.birth_month, group.birth_day)
					const plural = new Intl.PluralRules().select(countdown)
					const birthdayString = birthday(group.birth_month, group.birth_day)
					return (
						<Card key={`group-${group.id}`} className="bg-accent">
							<CardHeader className="flex-row items-center gap-1 py-5 pb-4">
								<CardTitle className="flex flex-wrap items-center gap-2">
									<Avatar className="border w-9 h-9 border-input">
										<AvatarImage src={group.image} />
										<AvatarFallback className="font-bold bg-background text-foreground">{group.display_name?.charAt(0)}</AvatarFallback>
									</Avatar>
									{group.display_name}
									{birthdayString && (
										<>
											<Badge variant="outline" className="text-muted-foreground whitespace-nowrap">
												{birthdayString}
											</Badge>
											{countdown < 31 && (
												<Badge variant="default" className="whitespace-nowrap">
													{countdown} {plural === 'one' ? 'day' : 'days'}
												</Badge>
											)}
										</>
									)}
								</CardTitle>
							</CardHeader>
							<CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
								<ListBlock lists={group.lists as List[]} isOwner={currentUser?.id === group.user_id} />
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
