import log from '../utils/log'

export async function runSteps(name: string, functions: Array<() => void>) {
  const spinner = log.step(`Setting up ${name}...`)

  try {
    for (const func of functions) {
      await func()
    }
  } catch {
    // TODO: print stacktrace
    return spinner.fail('Failed to add Github templates.')
  }

  spinner.succeed('Added Github templates!')
}

// TODO: improve type
export function partial(
  func: (...args: unknown[]) => Promise<unknown>,
  ...args: unknown[]
) {
  return func.bind(undefined, ...args)
}
