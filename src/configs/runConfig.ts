import { ConfigKey } from '../types'
import { eslintConfig } from './eslint'
import { prettierConfig } from './prettier'

export function runConfig(key: ConfigKey) {
  switch (key) {
    case 'eslint':
      return eslintConfig()
    case 'prettier':
      return prettierConfig()
    default:
      return null
  }
}
