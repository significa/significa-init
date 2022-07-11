import fs from 'fs'
import path from 'path'

import jsonfile from 'jsonfile'

import log from '../utils/log'
import { addPackages, addScript } from '../utils/package'

export function typescriptConfig() {
  const spinner = log.step('Adding typescript configuration...')
  addPackages(['typescript', '@significa/tsconfig-config'], { dev: true })

  // Add config file
  const configPath = path.join(process.cwd(), 'tsconfig.json')

  if (fs.existsSync(configPath)) {
    return spinner.fail(
      'tsconfig.json already exists. To avoid conflicts, we have not modified it. Please refer to https://github.com/significa/significa-style for instructions on how to configure typescript.'
    ) // TODO: Add link
  }

  const configContent = {
    extends: './node_modules/@significa/tsconfig-config/index.json',
  }
  jsonfile.writeFileSync(configPath, configContent, { spaces: 2 })

  // Add script
  try {
    addScript('validate:types', 'tsc --noEmit')
  } catch {
    return spinner.fail(
      'Failed to add typescript script to package.json. Please refer to https://github.com/significa/significa-style for instructions on how to configure typescript.'
    )
  }

  spinner.succeed('Added typescript configuration')
}
