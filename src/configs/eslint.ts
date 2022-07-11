import fs from 'fs'
import path from 'path'

import jsonfile from 'jsonfile'

import log from '../utils/log'
import { addPackages } from '../utils/package'

export function eslintConfig() {
  log.info('Adding ESLint configuration...')
  addPackages(['eslint', '@significa/eslint-config'], { dev: true })

  const eslintrcPath = path.join(process.cwd(), '.eslintrc.json')

  if (fs.existsSync(eslintrcPath)) {
    return log.error(
      '.eslintrc.json already exists. To avoid conflicts, we have not modified it. Please refer to https://github.com/significa/significa-style for instructions on how to configure the eslint plugin.'
    ) // TODO: Add link
  }

  const eslintrcContent = {
    extends: ['@significa'],
  }
  jsonfile.writeFileSync(eslintrcPath, eslintrcContent, { spaces: 2 })
}
