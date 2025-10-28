import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactYouMightNotNeedAnEffect from 'eslint-plugin-react-you-might-not-need-an-effect'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

const config = [
	...compat.extends('next/core-web-vitals'),
	{
		plugins: {
			react,
		},
		rules: {
			'react/no-unescaped-entities': 'warn',
		},
	},
	reactYouMightNotNeedAnEffect.configs.recommended,
]

export default config
