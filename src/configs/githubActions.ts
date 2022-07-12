import path from 'path'
import { cwd } from 'process'

import copyDir from '../utils/copyDir'
import log from '../utils/log'

export function githubActionsConfig() {
  const spinner = log.step('Adding Github actions...')

  try {
    copyDir(
      path.join(__dirname, '../templates/githubActions').toString(),
      cwd()
    )
  } catch {
    return spinner.fail('Failed to add Github actions.')
  }

  spinner.succeed('Added Github actions!')
}
