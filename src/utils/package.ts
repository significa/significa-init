import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import inquirer from 'inquirer'
import jsonfile from 'jsonfile'

import { PackageManager } from '../types'

type PackageOptions = {
  dev?: boolean
}

export async function addPackage(name: string, options?: PackageOptions) {
  const packageManager = await getPackageManager()
  switch (packageManager) {
    case 'npm':
      execSync(`npm install ${name} ${options?.dev ? '--save-dev' : '--save'}`)
      break
    case 'yarn':
      execSync(`yarn add ${name} ${options?.dev ? '--dev' : ''}`, {
        stdio: 'ignore',
      })
      break
    default:
      throw new Error(`Unknown package manager: ${packageManager}`)
  }
}

export async function addPackages(
  packages: string[],
  options?: PackageOptions
) {
  for (const packageName of packages) {
    await addPackage(packageName, options)
  }
}

export function addScript(key: string, value: string, safe = false) {
  const packagePath = path.join(process.cwd(), 'package.json')
  const content = jsonfile.readFileSync(packagePath)
  if (!content.scripts) {
    content.scripts = {}
  }

  if (safe && content.scripts[key]) {
    throw new Error('Specified script already exists')
  }

  content.scripts[key] = value
  jsonfile.writeFileSync(packagePath, content, { spaces: 2 })
}

export function hasDependency(name: string) {
  const packagePath = path.join(process.cwd(), 'package.json')
  const content = jsonfile.readFileSync(packagePath)

  return (
    (Object.keys(content.dependencies) || []).includes(name) ||
    (Object.keys(content.devDependencies) || []).includes(name)
  )
}

export async function getPackageManager(): Promise<PackageManager> {
  // detects package manager, if package-lock.json exists, it's probably npm, if yarn.lock exists, it's probably yarn. Otherwise, ask
  const packageLockPath = path.join(process.cwd(), 'package-lock.json')
  const yarnLockPath = path.join(process.cwd(), 'yarn.lock')
  if (fs.existsSync(packageLockPath)) {
    return 'npm'
  }
  if (fs.existsSync(yarnLockPath)) {
    return 'yarn'
  }

  const userChoice = await inquirer.prompt({
    name: 'packageManager',
    message: 'Which package manager do you use?',
    type: 'list',
    choices: ['npm', 'yarn'],
  })

  switch (userChoice.packageManager) {
    case 'npm':
      fs.writeFileSync(packageLockPath, '')
      break
    case 'yarn':
      fs.writeFileSync(yarnLockPath, '')
      break
    default:
      throw new Error('Invalid option')
  }

  return userChoice.packageManager as PackageManager
}
