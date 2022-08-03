import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import log from './log'

export async function gitInit() {
  const cwd = process.cwd()

  // Check if git folder exists
  const gitFolder = path.join(cwd, '.git')
  if (fs.existsSync(gitFolder)) {
    return
  }

  const spinner = log.step('Initializing git repository')

  execSync(`rm -rf .git`)
  execSync(`git init`)

  spinner.succeed()
}
