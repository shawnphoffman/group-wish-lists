'use client'

import { startTransition, useCallback, useState } from 'react'
import { faApple } from '@awesome.me/kit-f973af7de0/icons/classic/brands'
import { faSpinnerScale } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { createMultipleItems } from '@/app/actions/items'
import { List } from '@/components/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { MenubarShortcut } from '@/components/ui/menubar'
import { Textarea } from '@/components/ui/textarea'

type Props = {
	listId: List['id']
}

type MarkdownParse = {
	title: string
	notes: string
}

export default function ImportAppleButton({ listId }: Props) {
	const [open, setOpen] = useState(false)
	const [data, setData] = useState<MarkdownParse[]>([])
	const [rawMarkdown, setRawMarkdown] = useState('')
	const [converting, setConverting] = useState(false)
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const handleSubmit = useCallback(() => {
		setLoading(true)

		async function importItems() {
			const resp = await createMultipleItems(listId, data)
			setOpen(false)
			setLoading(false)
			if (resp?.status === 'success') {
				startTransition(() => {
					setData([])
					setRawMarkdown('')
					router.refresh()
				})
			}
		}

		importItems()
	}, [data, listId, router])

	const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
		e.target.style.height = 'inherit'
		e.target.style.height = `${e.target.scrollHeight}px`
		setRawMarkdown(e.target.value)
	}, [])

	const handleConvert = useCallback(() => {
		setConverting(true)
		async function doStuff() {
			const url = `/api/markdown?raw=${encodeURIComponent(rawMarkdown)}`
			const resp = await fetch(url)

			if (resp) {
				const json: MarkdownParse[] = await resp?.json()
				setData(json)
			}
			setConverting(false)
		}
		doStuff()
	}, [rawMarkdown])
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
				Apple Notes
				<MenubarShortcut>
					<FontAwesomeIcon icon={faApple} />
				</MenubarShortcut>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Import from Apple Notes</DialogTitle>
					<DialogDescription>It is not a perfect import so you might need to make adjustments afterward.</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					{/* TEXTAREA */}
					<div className="grid w-full gap-1.5">
						<Label htmlFor="notes">Paste Notes Here</Label>
						<Textarea id="notes" onChange={handleChange} value={rawMarkdown} disabled={loading || converting} />
					</div>
					{/* CONVERT BUTTON */}
					<Button variant={'secondary'} type="button" onClick={handleConvert} disabled={loading || converting || !rawMarkdown}>
						{converting ? 'Converting...' : 'Convert Apple Notes'}
					</Button>
					{loading && <FontAwesomeIcon icon={faSpinnerScale} fixedWidth spinPulse className="self-center text-xl" />}
				</div>
				{data.length > 0 && (
					<DialogFooter>
						<div className="flex flex-col w-full gap-2">
							<DialogTitle>Conversion Results</DialogTitle>
							<div className="flex flex-col w-full gap-1">
								{data.map(token => (
									<div key={token.title} className="">
										<div className="font-medium">- {token.title}</div>
										{token.notes && (
											<div className="pl-4 overflow-hidden text-xs text-muted-foreground whitespace-break-spaces text-ellipsis">
												{token.notes}
											</div>
										)}
									</div>
								))}
							</div>
							<Button type="button" onClick={handleSubmit} disabled={loading || converting}>
								{loading ? 'Importing...' : 'Import Conversion'}
							</Button>
						</div>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	)
}
