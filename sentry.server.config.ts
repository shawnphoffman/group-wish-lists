// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

Sentry.init({
	dsn: 'https://5fec01ffba926f16a97d93470a7b17ec@o508348.ingest.sentry.io/4506600135262208',

	// Adjust this value in production, or use tracesSampler for greater control
	tracesSampleRate: 0.1,

	// Setting this option to true will print useful information to the console while you're setting up Sentry.
	debug: false,
})
