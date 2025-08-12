'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
// import { Separator } from '@/components/ui/separator'

export default function NavBreadcrumbs() {
	const pathname = usePathname()

	const isBeyondEditing = pathname.includes('/select')
	const isEditingList = pathname.includes('/edit') || isBeyondEditing
	const isViewingList = pathname.includes('/lists/')

	const parentCrumb = isEditingList
		? {
				href: '/me',
				label: 'My Lists',
			}
		: isViewingList
			? {
					href: '/',
					label: 'All Lists',
				}
			: null

	if (!parentCrumb) return null
	return (
		<>
			{/* <Separator orientation="vertical" className="h-4 mr-2" /> */}
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link href={parentCrumb.href}>{parentCrumb.label}</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					{isBeyondEditing && (
						<>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link href={pathname.replace('/select', '/edit')}>Current List</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
						</>
					)}
				</BreadcrumbList>
			</Breadcrumb>
		</>
	)
}
