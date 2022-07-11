import { ConfigKey } from '../types'
import { eslintConfig } from './eslint'

export function runConfig(key: ConfigKey) {
  switch (key) {
    case 'eslint':
      return eslintConfig()
    default:
      return null
  }
}
