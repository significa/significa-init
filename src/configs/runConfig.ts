import { ConfigKey } from '../types'
import { eslintConfig } from './eslint'
import { prettierConfig } from './prettier'
import { typescriptConfig } from './typescript'

export function runConfig(key: ConfigKey) {
  switch (key) {
    case 'eslint':
      return eslintConfig()
    case 'prettier':
      return prettierConfig()
    case 'typescript':
      return typescriptConfig()
    default:
      return null
  }
}
