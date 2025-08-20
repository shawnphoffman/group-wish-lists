import { Suspense } from 'react'
import { faGift } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { faCirclePlus, faGrapes, faListCheck, faListOl, faRadio } from '@awesome.me/kit-f973af7de0/icons/sharp-duotone/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import NavBottom from '@/components/sidebar/nav-bottom'
import NavSection, { type NavItem } from '@/components/sidebar/nav-section'
import { NavUser } from '@/components/sidebar/nav-user'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

type SidebarProps = React.ComponentProps<typeof Sidebar>

const main: NavItem[] = [
	{
		name: 'All Lists',
		url: '/',
		icon: faListCheck,
		// isActive: true,
		// items: [
		// 	{
		// 		name: 'History',
		// 		url: '#',
		// 	},
		// ],
	},
	{
		name: 'My Lists',
		url: '/me',
		icon: faListOl,
	},
]

const actions: NavItem[] = [
	{
		name: 'Quick Add Item',
		url: '/import',
		icon: faCirclePlus,
	},
	{
		name: 'Create New List',
		url: '/me?new=true',
		icon: faCirclePlus,
	},
]

const feeds: NavItem[] = [
	{
		name: 'Recent Comments',
		url: '/comments',
		icon: faGrapes,
	},
	{
		name: 'Recent Items',
		url: '/recent',
		icon: faRadio,
	},
]

export function AppSidebar({ ...props }: SidebarProps) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link href="/" className="" prefetch>
								<div className="flex items-center justify-center rounded-lg aspect-square size-8 bg-destructive text-destructive-foreground hover:animate-spin">
									<FontAwesomeIcon icon={faGift} size="lg" className="transition-colors" />
								</div>
								<span className="text-lg font-bold truncate">Wish Lists</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				{/* <NavMain /> */}
				<NavSection title="Lists" items={main} />
				<NavSection title="Actions" items={actions} />
				<NavSection title="Feeds" items={feeds} />
				<NavBottom />
			</SidebarContent>
			<SidebarFooter>
				<Suspense fallback={null}>
					<NavUser />
				</Suspense>
			</SidebarFooter>
		</Sidebar>
	)
}
