import { ConfigKey } from '../types'
import { eslintConfig } from './eslint'
import { githubActions } from './githubActions'
import { githubTemplates } from './githubTemplates'
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
    case 'gh-actions':
      return githubActions()
    case 'gh-templates':
      return githubTemplates()
    default:
      return null
  }
}
