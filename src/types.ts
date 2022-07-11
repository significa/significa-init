export type ConfigKey = 'eslint'

export const isConfigKey = (key: string): key is ConfigKey => {
  return ['eslint'].includes(key)
}

export const isConfigKeyArray = (keys: unknown): keys is ConfigKey[] => {
  return Array.isArray(keys) && keys.every(isConfigKey)
}
