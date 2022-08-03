import { execSync } from 'child_process'

import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'

import { addPackageJsonScript } from './actionSteps/addPackageJsonScript'
import { copyDir } from './actionSteps/copyDir'
import { installPackages } from './actionSteps/installPackages'
import { runSteps } from './actionSteps/runSteps'
import { setupEslint } from './actionSteps/setupEslint'
import { setupPrettier } from './actionSteps/setupPrettier'
import { setupTypescript } from './actionSteps/setupTypescript'
import { action } from './types'
import log from './utils/log'
import { getPackageManager } from './utils/package'

const ACTIONS: action[] = [
  {
    id: 'eslint',
    name: 'ESLint',
    enabledByDefault: true,
    run: setupEslint,
  },
  {
    id: 'prettier',
    name: 'Prettier',
    enabledByDefault: true,
    run: setupPrettier,
  },
  {
    id: 'typescript',
    name: 'Typescript',
    enabledByDefault: true,
    run: setupTypescript,
  },
  {
    id: 'gh-actions',
    name: 'Github actions',
    enabledByDefault: true,
    run: async () => copyDir('./templates/github-actions'),
  },
  {
    id: 'gh-templates',
    name: 'Github templates',
    enabledByDefault: true,
    run: async () => copyDir('./templates/github-templates'),
  },
  {
    id: 'husky',
    name: 'Husky',
    enabledByDefault: true,
    run: async () => {
      await copyDir('./templates/husky')
      await installPackages(
        [
          'husky',
          '@commitlint/cli',
          '@commitlint/config-conventional',
          'lint-staged',
        ],
        { dev: true }
      )
      await addPackageJsonScript('postinstall', 'husky install', false)
    },
  },
  {
    id: 'nvmrc',
    name: '.nvmrc',
    enabledByDefault: true,
    run: async () => copyDir('./templates/nvmrc'),
  },
  {
    id: 'install-deps',
    name: 'Install dependencies',
    enabledByDefault: true,
    run: async () => {
      const packageManager = await getPackageManager()
      execSync(`${packageManager} install`)
    },
  },
]

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

    const actionIds =
      args.configs ||
      (
        await inquirer.prompt({
          message: 'What configurations would you like to add?',
          type: 'checkbox',
          name: 'configs',
          choices: ACTIONS.map((config) => ({
            value: config.id,
            name: config.name,
            checked: config.enabledByDefault,
          })),
        })
      ).configs

    ACTIONS.filter((action) => actionIds.includes(action.id)).forEach(
      (action) => runSteps(action.name, action.run)
    )

    log.success('Done! 🎉')
  }
}

export = SignificaStart
