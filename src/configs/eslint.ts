import fs from 'fs'
import path from 'path'

import jsonfile from 'jsonfile'

import log from '../utils/log'
import { addPackages, addScript, hasDependency } from '../utils/package'

export async function eslintConfig() {
  const spinner = log.step('Adding ESLint configuration...')

  try {
    const ext = ['@significa']
    if (hasDependency('react')) {
      ext.push('@significa/eslint-config/react')
    }

    let configContent = {
      extends: ext,
    }

    const configPath = path.join(process.cwd(), '.eslintrc.json')

    if (fs.existsSync(configPath)) {
      const file = fs.readFileSync(configPath, 'utf8')
      const config = JSON.parse(file)

      if (config.extends) {
        configContent = {
          extends: Array.isArray(config.extends)
            ? [...config.extends, ...ext]
            : [config.extends, ...ext],
        }
      } else {
        configContent = {
          extends: ext,
          ...config,
        }
      }
    }

    addScript('lint', 'eslint "src/**/*.{js,jsx,ts,tsx}"')

    await addPackages(['eslint', '@significa/eslint-config'], { dev: true })
    jsonfile.writeFileSync(configPath, configContent, { spaces: 2 })

    spinner.succeed('Added ESLint configuration')
  } catch (error) {
    return spinner.fail(
      `Could not add Eslint.\n
    Please refer to https://github.com/significa/significa-style/tree/master/packages/eslint-config for instructions on how to configure it.\n
      `
    )
  }
}
