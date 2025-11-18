'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function TestPage() {
	const [url, setUrl] = useState('')
	const [loading, setLoading] = useState(false)
	const [response, setResponse] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(null)
		setResponse(null)

		try {
			const res = await fetch('/api/test-proxy', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					url: url,
				}),
			})

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`)
			}

			const data = await res.json()
			setResponse(JSON.stringify(data, null, 2))
		} catch (err) {
			console.error('error', err)
			setError(err instanceof Error ? err.message : 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="container max-w-4xl p-8 mx-auto">
			<h1 className="mb-6 text-3xl font-bold">URL Test Page</h1>

			<form onSubmit={handleSubmit} className="mb-6 space-y-4">
				<div className="space-y-2">
					<Label htmlFor="url">URL</Label>
					<div className="flex gap-2">
						<Input
							id="url"
							type="url"
							value={url}
							onChange={e => setUrl(e.target.value)}
							placeholder="http://www.google.com/"
							className="flex-1"
							required
						/>
						<Button type="submit" disabled={loading || !url}>
							{loading ? 'Loading...' : 'Submit'}
						</Button>
					</div>
				</div>
			</form>

			{error && (
				<div className="p-4 mb-4 border rounded-md bg-destructive/10 border-destructive">
					<p className="font-medium text-destructive">Error:</p>
					<p className="text-destructive">{error}</p>
				</div>
			)}

			{response && (
				<div className="space-y-2">
					<Label>Response:</Label>
					<pre className="p-4 overflow-auto border rounded-md bg-muted border-border">
						<code className="text-sm">{response}</code>
					</pre>
				</div>
			)}
		</div>
	)
}
