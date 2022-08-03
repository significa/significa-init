import { execSync } from 'child_process'

import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import figlet from 'figlet'
import inquirer from 'inquirer'

import { addPackageJsonScript } from './actionSetps/addPackageJsonScript'
import { copyDir } from './actionSetps/copyDir'
import { installPackages } from './actionSetps/installPackages'
import { partial, runSteps } from './actionSetps/runSteps'
import { setupEslint } from './actionSetps/setupEslint'
import { setupPrettier } from './actionSetps/setupPrettier'
import { setupTypescript } from './actionSetps/setupTypescript'
import { action } from './types'
import log from './utils/log'
import { getPackageManager } from './utils/package'

const ACTIONS: action[] = [
  {
    id: 'eslint',
    name: 'ESLint',
    enabledByDetault: true,
    setps: [setupEslint],
  },
  {
    id: 'prettier',
    name: 'Prettier',
    enabledByDetault: true,
    setps: [setupPrettier],
  },
  {
    id: 'typescript',
    name: 'Typescript',
    enabledByDetault: true,
    setps: [setupTypescript],
  },
  {
    id: 'gh-actions',
    name: 'Github actions',
    enabledByDetault: true,
    setps: [partial(copyDir, './templates/github-actions')],
  },
  {
    id: 'gh-templates',
    name: 'Github templates',
    enabledByDetault: true,
    setps: [partial(copyDir, './templates/github-templates')],
  },
  {
    id: 'husky',
    name: 'Husky',
    enabledByDetault: true,
    setps: [
      partial(copyDir, './templates/husky'),
      partial(
        installPackages,
        [
          'husky',
          '@commitlint/cli',
          '@commitlint/config-conventional',
          'lint-staged',
        ],
        { dev: true }
      ),
      partial(addPackageJsonScript, 'postinstall', 'husky install', false),
    ],
  },
  {
    id: 'nvmrc',
    name: '.nvmrc',
    enabledByDetault: true,
    setps: [partial(copyDir, './templates/nvmrc')],
  },
  {
    id: 'install-deps',
    name: 'Install dependencies',
    enabledByDetault: true,
    setps: [
      async () => {
        const packageManager = await getPackageManager()
        execSync(`${packageManager} install`)
      },
    ],
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
            checked: config.enabledByDetault,
          })),
        })
      ).configs

    ACTIONS.filter((action) => actionIds.includes(action.id)).forEach(
      (action) => runSteps(action.name, action.setps)
    )

    log.success('Done! 🎉')
  }
}

export = SignificaStart
