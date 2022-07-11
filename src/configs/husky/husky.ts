import path from 'path'
import { cwd } from 'process'

import copyDir from '../../utils/copyDir'
import log from '../../utils/log'
import { addPackage, addScript } from '../../utils/package'

export function huskyConfig() {
  const spinner = log.step('Adding Husky...')

  try {
    copyDir(path.join(__dirname, './to_copy').toString(), cwd())
    addPackage('husky', { dev: true })
    addScript('postinstall', 'husky install')
  } catch {
    return spinner.fail('Failed to add Husky.')
  }

  spinner.succeed('Added Husky!')
}
