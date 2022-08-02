import path from 'path'

import jsonfile from 'jsonfile'

export async function addScript(
  scriptName: string,
  value: string,
  overwrite = false
) {
  const packagePath = path.join(process.cwd(), 'package.json')
  const content = jsonfile.readFileSync(packagePath)
  if (!content.scripts) {
    content.scripts = {}
  }

  if (!overwrite && content.scripts[scriptName]) {
    throw new Error('Specified script already exists')
  }

  content.scripts[scriptName] = value
  jsonfile.writeFileSync(packagePath, content, { spaces: 2 })
}

export function AddScript(
  scriptName: string,
  value: string,
  overwrite: boolean
) {
  return addScript.bind(undefined, scriptName, value, overwrite)
}
