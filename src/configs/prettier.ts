import fs from 'fs'
import path from 'path'

import log from '../utils/log'
import { addPackages, addScript, getPackageManager } from '../utils/package'

export async function prettierConfig() {
  const spinner = log.step('Adding Prettier configuration...')

  // Add config file
  const configPath = path.join(process.cwd(), '.prettierrc')

  if (fs.existsSync(configPath)) {
    const packageManager = await getPackageManager()
    return spinner.fail(
      `Could not add Prettier: .prettierrc already exists. To avoid conflicts, we have not modified it.\n
    To include it manually, run:\n
    ${
      packageManager === 'yarn'
        ? `yarn add --dev prettier @significa/prettier-config`
        : `npm i --save-dev prettier @significa/prettier-config`
    }\n
    echo '"@significa/prettier-config"' >> .prettierrc\n`
    )
  }

  // Add dependencies
  await addPackages(['prettier', '@significa/prettier-config'], { dev: true })

  const configContent = `"@significa/prettier-config"`
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
