import path from 'path'
import { cwd } from 'process'

import copyDir from '../utils/copyDir'
import { gitInit } from '../utils/git'
import log from '../utils/log'
import { addPackages, addScript } from '../utils/package'

export async function huskyConfig() {
  const spinner = log.step('Adding Husky...')

  try {
    gitInit()
    copyDir(path.join(__dirname, '../templates/husky').toString(), cwd())
    await addPackages(
      [
        'husky',
        '@commitlint/cli',
        '@commitlint/config-conventional',
        'lint-staged',
      ],
      { dev: true }
    )
    addScript('postinstall', 'husky install')
  } catch (e) {
    console.log(e)
    return spinner.fail('Failed to add Husky.')
  }

  spinner.succeed('Added Husky!')
}
