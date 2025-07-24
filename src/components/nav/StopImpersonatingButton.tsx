'use client'

import { useState } from 'react'
import { faFaceDisguise } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { stopImpersonation } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

type Props = {
	impersonating: string
}

export default function StopImpersonatingButton({ impersonating }: Props) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const handleStopImpersonation = async () => {
		try {
			setIsLoading(true)
			const result = await stopImpersonation(impersonating)
			// console.log('result', result)
			if (result.link) {
				router.push(result.link)
				router.refresh()
			}
		} catch (error) {
			// console.error('Error stopping impersonation:', error)
			window.location.href = '/'
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Button
			size="icon"
			variant="destructive"
			className="px-2 mr-2"
			onClick={handleStopImpersonation}
			disabled={isLoading}
			title={`Stop Impersonating > ${impersonating}`}
		>
			<FontAwesomeIcon icon={faFaceDisguise} size="xl" className={`text-destructive-foreground ${isLoading ? 'animate-spin' : ''}`} />
		</Button>
	)
}
