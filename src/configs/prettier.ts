import fs from 'fs'
import path from 'path'

import log from '../utils/log'
import { addPackages, addScript } from '../utils/package'

export async function prettierConfig() {
  const spinner = log.step('Adding Prettier configuration...')
  await addPackages(['prettier', '@significa/prettier-config'], { dev: true })

  // Add config file
  const configPath = path.join(process.cwd(), '.prettierrc.js')

  if (fs.existsSync(configPath)) {
    return spinner.fail(
      '.prettierrc.js already exists. To avoid conflicts, we have not modified it. Please refer to https://github.com/significa/significa-style for instructions on how to configure prettier.'
    ) // TODO: Add link
  }

  const configContent = `module.exports = require("@significa/prettier-config");`
  fs.writeFileSync(configPath, configContent)

  // Add script
  try {
    addScript(
      'prettier',
      'prettier "src/**/*.+(ts|tsx|js|jsx|json|yml|yaml|md|mdx)" --write'
    )
  } catch {
    return spinner.fail(
      'Failed to add prettier script to package.json. Please refer to https://github.com/significa/significa-style for instructions on how to configure prettier.'
    )
  }

  spinner.succeed('Added Prettier configuration')
}
