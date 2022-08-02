import fs from 'fs'
import path from 'path'

import log from '../utils/log'

export function nvmrcConfig() {
  const spinner = log.step('Adding .nvmrc ...')

  try {
    fs.writeFileSync(path.join(process.cwd(), '.nvmrc'), '18')

    spinner.succeed('Added .nvmrc!')
  } catch (error) {
    return spinner.fail('Failed to add .nvmrc')
  }
}
