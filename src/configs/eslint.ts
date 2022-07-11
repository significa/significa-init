import fs from 'fs'
import path from 'path'

import jsonfile from 'jsonfile'

import log from '../utils/log'
import { addPackages, addScript } from '../utils/package'

export async function eslintConfig() {
  const spinner = log.step('Adding ESLint configuration...')
  await addPackages(['eslint', '@significa/eslint-config'], { dev: true })

  // Add config file
  const configPath = path.join(process.cwd(), '.eslintrc.json')

  if (fs.existsSync(configPath)) {
    return spinner.fail(
      '.eslintrc.json already exists. To avoid conflicts, we have not modified it. Please refer to https://github.com/significa/significa-style for instructions on how to configure the eslint plugin.'
    ) // TODO: Add link
  }

  const eslintrcContent = {
    extends: ['@significa'],
  }
  jsonfile.writeFileSync(configPath, eslintrcContent, { spaces: 2 })

  // Add script
  try {
    addScript('lint', 'eslint "src/**/*.{js,jsx,ts,tsx}"')
  } catch {
    return spinner.fail(
      'Failed to add eslint script to package.json. Please refer to https://github.com/significa/significa-style for instructions on how to configure eslint.'
    )
  }

  spinner.succeed('Added ESLint configuration')
}
