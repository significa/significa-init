import fs from 'fs'
import path from 'path'

import jsonfile from 'jsonfile'

import log from '../utils/log'
import { addPackages, addScript, hasDependency } from '../utils/package'

export function typescriptConfig() {
  const spinner = log.step('Adding typescript configuration...')

  const extendsContent = hasDependency('react-native')
    ? './node_modules/@significa/tsconfig-config/react-native.json'
    : './node_modules/@significa/tsconfig-config/index.json'

  const configPath = path.join(process.cwd(), 'tsconfig.json')

  let configContent = {
    extends: extendsContent,
  }

  if (fs.existsSync(configPath)) {
    try {
      const file = fs.readFileSync(configPath, 'utf8')
      const config = JSON.parse(file)

      // tsconfig only allows one `extends`. it's safer to fail and provide manual instructions.
      if (config.extends) {
        throw new Error()
      }

      configContent = {
        extends: extendsContent,
        ...config,
      }
    } catch (error) {
      return spinner.fail(
        `tsconfig.json already exists with an 'extends' key. To avoid conflicts, we have not modified it.\n
    Please refer to https://github.com/significa/significa-style/tree/master/packages/tsconfig-config for instructions on how to configure it.\n
        `
      )
    }
  }

  addScript('validate:types', 'tsc --noEmit')

  addPackages(['typescript', '@significa/tsconfig-config'], { dev: true })
  jsonfile.writeFileSync(configPath, configContent, { spaces: 2 })

  spinner.succeed('Added typescript configuration')
}
