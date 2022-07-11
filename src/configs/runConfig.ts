import { ConfigKey } from '../types'
import { eslintConfig } from './eslint'
import { githubActionsConfig } from './githubActions'
import { githubTemplatesConfig } from './githubTemplates'
import { huskyConfig } from './husky'
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
      return githubActionsConfig()
    case 'gh-templates':
      return githubTemplatesConfig()
    case 'husky':
      return huskyConfig()
    default:
      return null
  }
}
