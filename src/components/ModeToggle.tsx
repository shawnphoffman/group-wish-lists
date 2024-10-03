'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ModeToggle() {
	const { setTheme, theme, systemTheme } = useTheme()

	const handleToggle = React.useCallback(() => {
		if (theme === 'dark') {
			setTheme('light')
		} else if (theme === 'light') {
			setTheme('dark')
		} else {
			if (systemTheme === 'dark') {
				setTheme('light')
			} else {
				setTheme('dark')
			}
		}
	}, [theme, setTheme, systemTheme])

	return (
		// <DropdownMenu>
		// 	<DropdownMenuTrigger asChild>
		<Button variant="outline" size="icon" className="w-9 h-9" onClick={handleToggle}>
			{theme === 'dark' ? (
				<Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
			) : (
				<Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
		// 	</DropdownMenuTrigger>
		// 	<DropdownMenuContent align="end">
		// 		<DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
		// 		<DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
		// 		<DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
		// 	</DropdownMenuContent>
		// </DropdownMenu>
	)
}
