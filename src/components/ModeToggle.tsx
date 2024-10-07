'use client'

import * as React from 'react'
import { faMoon, faSun } from '@awesome.me/kit-ac8ad9255a/icons/classic/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

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
		<Button variant="outline" size="icon" className="hidden w-9 h-9 sm:flex" onClick={handleToggle}>
			{theme === 'light' ? (
				<FontAwesomeIcon icon={faSun} className="h-[1.2rem] w-[1.2rem] transition-all" />
			) : (
				<FontAwesomeIcon icon={faMoon} className="h-[1.2rem] w-[1.2rem] transition-all" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
