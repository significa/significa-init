import { execSync } from 'child_process'
import path from 'path'
import { cwd } from 'process'

export async function copyDir(sourcePath: string) {
  sourcePath = path.join(__dirname, '..', sourcePath).toString()

  const destPath = cwd()

  execSync(`cp -r ${sourcePath}/ ${destPath}`)
}

export function CopyDir(sourcePath: string) {
  return copyDir.bind(null, sourcePath)
}
