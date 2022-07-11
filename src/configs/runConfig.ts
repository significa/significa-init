import { ConfigKey } from '../types'
import { eslintConfig } from './eslint'
import { githubActionsConfig } from './githubActions'
import { githubTemplatesConfig } from './githubTemplates'
import { huskyConfig } from './husky'
import { prettierConfig } from './prettier'
import { typescriptConfig } from './typescript'

export async function runConfig(key: ConfigKey) {
  switch (key) {
    case 'eslint':
      await eslintConfig()
      break
    case 'prettier':
      await prettierConfig()
      break
    case 'typescript':
      await typescriptConfig()
      break
    case 'gh-actions':
      await githubActionsConfig()
      break
    case 'gh-templates':
      await githubTemplatesConfig()
      break
    case 'husky':
      await huskyConfig()
      break
    default:
      return null
  }
}
