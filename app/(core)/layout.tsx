import AuthButton from '@/components/AuthButton'
import Nav from '@/components/Nav'

export default async function CoreLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col items-center flex-1 w-full gap-8">
			<nav className="flex justify-center w-full h-16 border-b border-b-foreground/10">
				<div className="flex items-center justify-between w-full max-w-4xl p-3 text-sm">
					<Nav />
					<AuthButton />
				</div>
			</nav>
			{children}
		</div>
	)
}
