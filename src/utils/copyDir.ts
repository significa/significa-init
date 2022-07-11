import { execSync } from 'child_process'

async function copyDir(source: string, target: string) {
  execSync(`cp -r ${source}/ ${target}`)
}

export default copyDir
