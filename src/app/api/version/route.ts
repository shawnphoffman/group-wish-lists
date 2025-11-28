import { NextResponse } from 'next/server'

/**
 * Returns the current deployment version identifier.
 * Uses Vercel's deployment ID if available, otherwise falls back to build timestamp.
 *
 * Vercel automatically sets VERCEL_DEPLOYMENT_ID during build, which changes on each deployment.
 */
export async function GET() {
	// Vercel provides VERCEL_DEPLOYMENT_ID which changes on each deployment
	// This is available at runtime in server-side code
	const deploymentId = process.env.VERCEL_DEPLOYMENT_ID

	// Fallback to build time if deployment ID is not available (e.g., local development)
	const buildTime = process.env.BUILD_TIME || process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString()

	// Use deployment ID if available, otherwise use build time
	const version = deploymentId || buildTime

	return NextResponse.json({ version })
}
