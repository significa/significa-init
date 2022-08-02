import { copyFile } from 'fs'
import path from 'path'
import { cwd } from 'process'

import log from '../utils/log'

export function nvmrcConfig() {
  const spinner = log.step('Adding .nvmrc ...')

  copyFile(
    path.join(__dirname, '../templates/.nvmrc').toString(),
    path.join(cwd(), '.nvmrc').toString(),
    (err) => {
      if (err) {
        return spinner.fail('Failed to add .nvmrc')
      }
      spinner.succeed('Added .nvmrc!')
    }
  )
}
