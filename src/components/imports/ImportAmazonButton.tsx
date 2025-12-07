'use client'

import { startTransition, useCallback, useState } from 'react'
import { faAmazon } from '@awesome.me/kit-f973af7de0/icons/classic/brands'
import { faSpinnerScale } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { createMultipleItems } from '@/app/actions/items'
import { List } from '@/components/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { MenubarShortcut } from '@/components/ui/menubar'

import { Input } from '../ui/input'

type Props = {
	listId: List['id']
}

type WishListParse = {
	title: string
	url: string
}

export default function ImportAmazonButton({ listId }: Props) {
	const [open, setOpen] = useState(false)
	const [data, setData] = useState<WishListParse[]>([])
	const [wishlistUrl, setWishlistUrl] = useState('')
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
					setWishlistUrl('')
					router.refresh()
				})
			}
		}

		importItems()
	}, [data, listId, router])

	const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setWishlistUrl(e.target.value)
	}, [])

	const handleConvert = useCallback(() => {
		setConverting(true)
		async function doStuff() {
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 30000)

			try {
				const url = `${process.env.NEXT_PUBLIC_AMAZON_SCRAPE_URL}?url=${encodeURIComponent(wishlistUrl)}`
				const resp = await fetch(url, { signal: controller.signal })

				if (resp) {
					const json: any[] = await resp?.json()

					const remapped: WishListParse[] = json.map(item => {
						return {
							title: item.title,
							url: item.link,
						}
					})

					setData(remapped)
				}
			} catch (error) {
				if (error.name === 'AbortError') {
					console.error('Request timed out')
				} else {
					console.error('Fetch error:', error)
				}
			} finally {
				clearTimeout(timeoutId)
				setConverting(false)
			}
		}
		doStuff()
	}, [wishlistUrl])
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full">
				Amazon Wish List
				<MenubarShortcut>
					<FontAwesomeIcon icon={faAmazon} />
				</MenubarShortcut>
			</DialogTrigger>
			<DialogContent className="max-w-2xl overflow-scroll max-h-dvh">
				<DialogHeader>
					<DialogTitle>Import from Amazon Wish List</DialogTitle>
					<DialogDescription className="flex flex-col gap-2">
						<div>
							Please make sure that your wish list is public so that the importer can view it appropriately. If you have issues, let me
							know.
						</div>
						<div>The process can take a bit of time so please be patient. If it fails to import, always try again just in case.</div>
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 py-4">
					{/* TEXTAREA */}
					<div className="grid w-full gap-1.5">
						<Label htmlFor="wishlist">Wish List URL</Label>
						<Input id="wishlist" onChange={handleChange} value={wishlistUrl} disabled={loading || converting} />
					</div>
					{/* IMPORT BUTTON */}
					<Button variant={'secondary'} type="button" onClick={handleConvert} disabled={loading || converting || !wishlistUrl}>
						{converting ? 'Importing...' : 'Import Wish List'}
					</Button>
					{loading && <FontAwesomeIcon icon={faSpinnerScale} fixedWidth spinPulse className="self-center text-xl" />}
				</div>
				<DialogFooter>
					{data.length > 0 && (
						<div className="flex flex-col w-full gap-2">
							<DialogTitle>Import Results</DialogTitle>
							<div className="flex flex-col w-full gap-1">
								{data.map(token => (
									<div key={token.title} className="">
										<div className="font-medium">- {token.title}</div>
										{token.url && (
											<div className="pl-4 overflow-hidden text-xs break-all text-muted-foreground whitespace-break-spaces text-ellipsis">
												{token.url}
											</div>
										)}
									</div>
								))}
							</div>
							<Button type="button" onClick={handleSubmit} disabled={loading || converting}>
								{loading ? 'Adding...' : 'Add Items to List'}
							</Button>
						</div>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
