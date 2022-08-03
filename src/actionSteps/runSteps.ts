import log from '../utils/log'

export async function runSteps(name: string, func: () => void) {
  const spinner = log.step(`Setting up ${name}...`)

  try {
    await func()
  } catch {
    // TODO: log stacktrace
    return spinner.fail('Failed to add Github templates.')
  }

  spinner.succeed('Added Github templates!')
}
