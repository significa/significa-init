import { execSync } from 'child_process'

import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'

import { runConfig } from './configs/runConfig'
import { isConfigKeyArray } from './types'
import log from './utils/log'
import { getPackageManager } from './utils/package'

class SignificaStart extends Command {
  static description = 'Significa project starter'

  static flags = {
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    name: flags.string({ char: 'n', description: "Project's name" }),
    // TODO: Add configs flag
  }

  static args = [] // TODO: Add configs arg

  async run() {
    log.info(
      `\n${chalk.yellow(
        figlet.textSync('significa-init', { horizontalLayout: 'default' })
      )}`
    )

    const { args } = this.parse(SignificaStart)

    const configs =
      args.configs ||
      (
        await inquirer.prompt({
          message: 'What configurations would you like to add?',
          type: 'checkbox',
          name: 'configs',
          choices: [
            {
              name: 'ESLint',
              value: 'eslint',
              checked: true,
            },
            {
              name: 'Prettier',
              value: 'prettier',
              checked: true,
            },
            {
              name: 'Typescript',
              value: 'typescript',
              checked: true,
            },
            {
              name: 'Github actions',
              value: 'gh-actions',
              checked: true,
            },
            {
              name: 'Github templates',
              value: 'gh-templates',
              checked: true,
            },
            {
              name: 'Husky',
              value: 'husky',
              checked: true,
            },
          ],
        })
      ).configs

    if (!isConfigKeyArray(configs)) {
      return log.error('Invalid configs selected!')
    }

    const packageManager = await getPackageManager() // Run once to force creation of package-lock or yarn.lock

    for (const configKey of configs) {
      await runConfig(configKey)
    }

    // Install dependencies
    const installSpinner = log.step('Installing dependencies')
    execSync(`${packageManager} install`)
    installSpinner.succeed()

    log.success('Done! 🎉')
  }
}

export = SignificaStart
