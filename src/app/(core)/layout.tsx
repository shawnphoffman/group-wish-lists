import 'react-toastify/dist/ReactToastify.css'
import '@/app/globals.css'

import { Suspense } from 'react'
import { Flip, ToastContainer } from 'react-toastify'

import Header from '@/components/nav/Header'

export default async function CoreLayout({ children }: { children: React.ReactNode }) {
	return (
		<Suspense>
			<div className="flex flex-col items-center flex-1 w-full gap-8">
				<Header />
				{children}
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
			</div>
		</Suspense>
	)
}
