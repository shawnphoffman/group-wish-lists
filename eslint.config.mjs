// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import shawnEslint from '@shawnphoffman/eslint-config/eslint.config.mjs'
import react from 'eslint-plugin-react'
import storybook from 'eslint-plugin-storybook'
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
	...shawnEslint,
	{
		plugins: {
			react,
		},

		rules: {
			'react/no-unescaped-entities': 'warn',
		},
	},
	...storybook.configs['flat/recommended'],
]

export default config
