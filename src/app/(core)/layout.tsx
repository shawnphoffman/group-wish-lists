import 'react-toastify/dist/ReactToastify.css'
import '@/app/globals.css'

import { Suspense } from 'react'
import { Flip, ToastContainer } from 'react-toastify'

import { NavigationEvents } from '@/components/navigation-events'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import NavBreadcrumbs from '@/components/sidebar/nav-breadcrumbs'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import Loading from './loading'

type Props = {
	children: React.ReactNode
}

export default async function CoreLayout({ children }: Props) {
	return (
		<>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className="top-0 z-10 flex items-center h-12 gap-2 shrink-0">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Suspense fallback={null}>
								<NavBreadcrumbs />
							</Suspense>
						</div>
					</header>
					<div className="flex flex-col items-center flex-1 gap-4 px-0 py-2 sm:px-2">
						<Suspense fallback={<Loading />}>{children}</Suspense>
					</div>
				</SidebarInset>
				{/* Handle navigation changes */}
				<Suspense fallback={null}>
					<NavigationEvents />
				</Suspense>
			</SidebarProvider>
			{/*  */}

			<ToastContainer
				position="bottom-center"
				autoClose={2500}
				limit={2}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				pauseOnFocusLoss={false}
				draggable={false}
				pauseOnHover
				theme="dark"
				transition={Flip}
			/>
		</>
	)
}
