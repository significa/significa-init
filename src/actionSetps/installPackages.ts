import { execSync } from 'child_process'

import { getPackageManager } from '../utils/package'

type PackageOptions = {
  dev?: boolean
}

export async function installPackages(
  packageNames: string[],
  options?: PackageOptions
) {
  const stringPackageNames = packageNames.join(' ')
  const packageManager = await getPackageManager()
  switch (packageManager) {
    case 'npm':
      execSync(
        `npm install ${stringPackageNames} ${
          options?.dev ? '--save-dev' : '--save'
        }`
      )
      break
    case 'yarn':
      execSync(
        `yarn add ${stringPackageNames} ${options?.dev ? '--dev' : ''}`,
        {
          stdio: 'ignore',
        }
      )
      break
    default:
      throw new Error(`Unknown package manager: ${packageManager}`)
  }
}
