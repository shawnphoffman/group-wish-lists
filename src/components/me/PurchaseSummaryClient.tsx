'use client'

import { useState, useMemo } from 'react'
import { getMyPurchases } from '@/app/actions/gifts'
import EmptyMessage from '@/components/common/EmptyMessage'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PurchaseSummaryList from './PurchaseSummaryList'
import { subDays } from 'date-fns/subDays'
import { isWithinInterval } from 'date-fns/isWithinInterval'

type PurchaseItem = Awaited<ReturnType<typeof getMyPurchases>>[number]

type PurchaseSummaryClientProps = {
	items: PurchaseItem[]
}

const isNovemberOrDecember = () => {
	const now = new Date()
	const currentMonth = now.getMonth()

	if (currentMonth === 10 || currentMonth === 11) {
		return true
	}

	return false
}

export default function PurchaseSummaryClient({ items }: PurchaseSummaryClientProps) {
	const [timeframe, setTimeframe] = useState<'60days' | '6months' | 'all'>(isNovemberOrDecember() ? '60days' : '6months')

	const filteredItems = useMemo(() => {
		if (timeframe === 'all') {
			return items
		}

		if (timeframe === '60days') {
			return items.filter(
				item =>
					item.gift_created_at && isWithinInterval(new Date(item.gift_created_at), { start: subDays(new Date(), 36), end: new Date() })
			)
		}

		// Filter for last 6 months
		const sixMonthsAgo = new Date()
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

		return items.filter(item => {
			if (!item.gift_created_at) return false
			const purchaseDate = new Date(item.gift_created_at)
			return purchaseDate >= sixMonthsAgo
		})
	}, [items, timeframe])

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<label htmlFor="timeframe-select" className="text-sm text-muted-foreground">
					Timeframe:
				</label>
				<Select value={timeframe} onValueChange={(value: '60days' | '6months' | 'all') => setTimeframe(value)}>
					<SelectTrigger id="timeframe-select" className="w-[180px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="60days">Last 60 days</SelectItem>
						<SelectItem value="6months">Last 6 months</SelectItem>
						<SelectItem value="all">All Time</SelectItem>
					</SelectContent>
				</Select>
			</div>
			{filteredItems?.length === 0 ? (
				<EmptyMessage message="No purchases found for the selected timeframe. Try adjusting the timeframe above." />
			) : (
				<PurchaseSummaryList items={filteredItems} />
			)}
		</div>
	)
}
