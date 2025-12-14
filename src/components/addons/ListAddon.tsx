'use client'

import { startTransition, useCallback, useState } from 'react'
import { faDollarSign, faHeadSideBrain } from '@awesome.me/kit-f973af7de0/icons/sharp/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/navigation'

import { deleteAddon, updateAddon } from '@/app/actions/addons'
import { DeleteIcon, EditIcon, LoadingIcon } from '@/components/icons/Icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatDateBasedOnAge } from '@/utils/date'

import MarkdownBlock from '../items/components/MarkdownBlock'

type Props = {
	created_at: string
	id: number
	is_gifter: boolean
	description: string
	display_name: string
	total_cost?: number | null
	notes?: string | null
}

// const linkOptions = {
// 	className: 'underline hover:text-primary break-all',
// 	target: '_blank',
// }

export default function ListAddon({ id, is_gifter, description, display_name, created_at, total_cost, notes }: Props) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [name, setName] = useState<string>(description || '')
	const [price, setPrice] = useState<string>(total_cost?.toString() || '')
	const [addonNotes, setAddonNotes] = useState<string>(notes || '')
	const [isSaving, setIsSaving] = useState(false)

	const handleDelete = useCallback(() => {
		async function asyncDeleteComment() {
			setLoading(true)
			await deleteAddon(id)
			router.refresh()
			setLoading(false)
		}
		asyncDeleteComment()
	}, [id, router])

	const handleSave = async () => {
		setIsSaving(true)
		try {
			const priceValue = price.trim() === '' ? null : parseFloat(price)
			const notesValue = addonNotes.trim() === '' ? null : addonNotes.trim()
			const nameValue = name.trim() === '' ? null : name.trim()

			// Validate price is a valid number if provided
			if (priceValue !== null && (isNaN(priceValue) || priceValue < 0)) {
				console.error('Invalid price value')
				setIsSaving(false)
				return
			}

			await updateAddon(id, nameValue, priceValue, notesValue)
			setIsDialogOpen(false)
			startTransition(() => {
				router.refresh()
			})
		} catch (error) {
			console.error('Failed to update addon details:', error)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<>
			<div className="flex flex-col w-full gap-2 p-3 hover:bg-muted">
				<div className="flex flex-row gap-x-3.5 items-center overflow-hidden">
					{/*  */}
					<FontAwesomeIcon icon={faHeadSideBrain} className="text-yellow-600 dark:text-yellow-300" />

					<div className="flex flex-col xs:flex-row gap-x-3.5 xs:items-center w-full">
						{/*  */}
						<div className="flex flex-col justify-center flex-1 gap-0 overflow-hidden">
							<div className="break-words">
								<MarkdownBlock>{description}</MarkdownBlock>
							</div>
							<div className="text-xs italic break-words whitespace-pre-line text-muted-foreground/50">
								Added: {formatDateBasedOnAge(created_at)}
							</div>
						</div>

						<div className="flex flex-row self-end xs:self-center items-center gap-3.5">
							{/*  */}
							<Badge variant={'outline'} className="">
								{display_name}
							</Badge>

							{/*  */}
							{is_gifter && (
								<>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => {
											setName(description || '')
											setPrice(total_cost?.toString() || '')
											setAddonNotes(notes || '')
											setIsDialogOpen(true)
										}}
										className="w-8 h-8 p-2 shrink-0"
									>
										<EditIcon />
									</Button>
									<Button variant="outline" size="sm" className="w-8 h-8 p-2" onClick={handleDelete} disabled={loading}>
										{loading ? <LoadingIcon size="lg" /> : <DeleteIcon />}
									</Button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="flex flex-col max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Addon</DialogTitle>
						<DialogDescription>Update the name, price, and notes for this addon.</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4 py-2">
						<div className="flex flex-col gap-2">
							<Label htmlFor="addon-name">Name</Label>
							<Textarea
								id="addon-name"
								placeholder="Addon name/description..."
								value={name}
								onChange={e => setName(e.target.value)}
								rows={3}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="addon-price">Price</Label>
							<div className="relative">
								<FontAwesomeIcon icon={faDollarSign} className="absolute w-4 h-4 -translate-y-1/2 top-1/2 left-3 text-muted-foreground" />
								<Input
									id="addon-price"
									type="number"
									className="bg-background pl-9"
									min="0"
									step="0.01"
									placeholder="0.00"
									value={price}
									onChange={e => setPrice(e.target.value)}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="addon-notes">Notes</Label>
							<Textarea
								id="addon-notes"
								placeholder="Add any notes about this addon..."
								value={addonNotes}
								onChange={e => setAddonNotes(e.target.value)}
								rows={3}
							/>
						</div>
						{addonNotes && (
							<div className="flex flex-col w-full gap-1.5">
								<Label htmlFor="notes-preview">Notes Preview</Label>
								<div className="grid ">
									<div className="inline px-3 py-2 text-sm border rounded-md text-foreground/75 border-input bg-background/50">
										<MarkdownBlock>{addonNotes}</MarkdownBlock>
									</div>
								</div>
							</div>
						)}
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
							Cancel
						</Button>
						<Button onClick={handleSave} disabled={isSaving}>
							{isSaving ? 'Saving...' : 'Save'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
