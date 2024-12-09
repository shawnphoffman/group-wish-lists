import { Suspense } from 'react'

import { FallbackRowThick } from '@/components/common/Fallbacks'
import MyLists, { ListType } from '@/components/me/MyLists'
import NewListButton from '@/components/me/NewListButton'
// import { Separator } from '@/components/ui/separator'

export default async function MyStuff() {
	// await new Promise(resolve => setTimeout(resolve, 5000))
	return (
		<div className="flex flex-col flex-1 w-full max-w-4xl xs:px-2 animate-page-in">
			<main className="flex flex-col flex-1 gap-8 divide-y">
				{/* LISTS */}
				<div className="flex flex-col gap-8">
					{/* Header */}
					<div className="flex flex-row flex-wrap justify-between">
						<h1 className="whitespace-nowrap">My Lists</h1>
						<div className="flex flex-row flex-wrap justify-end flex-1 gap-0.5 items-center md:justify-end shrink-0">
							<NewListButton />
						</div>
					</div>

					{/* PUBLIC LISTS */}
					<div className="flex flex-col gap-1">
						<h3>My Public Lists</h3>
						<div className="text-sm italic leading-tight text-muted-foreground">
							These are the lists that everybody can see and use for gift-giving. If a list is not in this section then it is either not
							public or you are not marked as the recipient.
						</div>
						<Suspense fallback={<FallbackRowThick />}>
							<MyLists type={ListType.PUBLIC} />
						</Suspense>
					</div>

					{/* PRIVATE LISTS */}
					<div className="flex flex-col gap-1">
						<h3>My Private Lists</h3>
						<div className="text-sm italic leading-tight text-muted-foreground">
							Nobody else can see these lists unless you explicitly make them an editor. These are nice for personal shopping lists or
							sitting on things you may want to add to a public list later.
						</div>
						<Suspense fallback={<FallbackRowThick />}>
							<MyLists type={ListType.PRIVATE} />
						</Suspense>
					</div>

					{/* GIFT IDEAS LISTS */}
					<div className="flex flex-col gap-1">
						<h3>Gift Ideas for Others</h3>
						<div className="text-sm italic leading-tight text-muted-foreground">
							These are idea lists for other people. These are helpful for adding things throughout the year that you think someone might
							like.
						</div>
						<Suspense fallback={<FallbackRowThick />}>
							<MyLists type={ListType.GIFT_IDEAS} />
						</Suspense>
					</div>

					{/* <Separator /> */}

					{/* SHARED WITH ME LISTS */}
					<div className="flex flex-col gap-1">
						<h3>Lists I Can Edit</h3>
						<div className="text-sm italic leading-tight text-muted-foreground">
							These are lists that others created and then added you as an editor. You can edit these lists from here or, if they are
							public, view them as a gift-giver from the main lists page.
						</div>
						<Suspense fallback={<FallbackRowThick />}>
							<MyLists type={ListType.SHARED_WITH_ME} />
						</Suspense>
					</div>

					{/* SHARED LISTS */}
					<div className="flex flex-col gap-1">
						<h3>My List Editors</h3>
						<div className="text-sm italic leading-tight text-muted-foreground">
							These are lists that you have added editors to. Editors are able to modify the items on your list just as you do but they can
							also view your list as gift giver.
						</div>
						<Suspense fallback={<FallbackRowThick />}>
							<MyLists type={ListType.SHARED_WITH_OTHERS} />
						</Suspense>
					</div>
				</div>
			</main>
		</div>
	)
}
