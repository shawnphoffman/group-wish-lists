import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import shawnEslint from '@shawnphoffman/eslint-config/eslint.config.mjs'
import react from 'eslint-plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default [
	...compat.extends('next/core-web-vitals'),
	...shawnEslint,
	{
		plugins: {
			react,
		},

		rules: {
			'react/no-unescaped-entities': 'warn',
		},
	},
]
