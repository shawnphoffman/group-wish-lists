'use client'

import { faFaceDisguise } from '@awesome.me/kit-ac8ad9255a/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { stopImpersonation } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'

type Props = {
	impersonating: string
}

export default function StopImpersonatingButton({ impersonating }: Props) {
	const handleStopImpersonation = async () => {
		const result = await stopImpersonation(impersonating)
		console.log('result', result)
		if (result.link) {
			window.location.href = result.link
		}
	}

	return (
		<Button
			size="icon"
			variant="destructive"
			className="px-2 mr-2"
			onClick={handleStopImpersonation}
			title={`Stop Impersonating > ${impersonating}`}
		>
			<FontAwesomeIcon icon={faFaceDisguise} size="xl" className="text-destructive-foreground" />
		</Button>
	)
}
