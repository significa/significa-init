import fs from 'fs'
import path from 'path'

import inquirer from 'inquirer'
import jsonfile from 'jsonfile'

import { PackageManager } from '../types'

type PackageOptions = {
  dev: boolean
}

export function addPackage(name: string, options?: PackageOptions) {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageContent = jsonfile.readFileSync(packagePath)
  if (!packageContent.dependencies) {
    packageContent.dependencies = {}
  }
  if (!packageContent.devDependencies) {
    packageContent.devDependencies = {}
  }

  if (options?.dev) {
    packageContent.devDependencies[name] = 'latest'
  } else {
    packageContent.dependencies[name] = 'latest'
  }

  jsonfile.writeFileSync(packagePath, packageContent, { spaces: 2 })
}

export function addPackages(packages: string[], options?: PackageOptions) {
  packages.forEach((packageName) => {
    addPackage(packageName, options)
  })
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

  return userChoice.packageManager as PackageManager
}
