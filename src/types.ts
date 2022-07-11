const configKeys = [
  'eslint',
  'prettier',
  'typescript',
  'gh-actions',
  'gh-templates',
  'husky',
] as const
export type ConfigKey = typeof configKeys[number]

export const isConfigKey = (key: string): key is ConfigKey => {
  return configKeys.includes(key as ConfigKey)
}

export const isConfigKeyArray = (keys: unknown): keys is ConfigKey[] => {
  return Array.isArray(keys) && keys.every(isConfigKey)
}

const packageManagers = ['npm', 'yarn'] as const
export type PackageManager = typeof packageManagers[number]
