import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import execa from 'execa'
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

    for (const configKey of configs) {
      runConfig(configKey)
    }

    // const name =
    //   args.name ||
    //   (
    //     await inquirer.prompt({
    //       message: "What's the name of the project?",
    //       type: 'input',
    //       name: 'name',
    //       default: 'hello-world',
    //     })
    //   ).name

    // if (fs.existsSync(name)) {
    //   log.error('Folder already exists')
    //   process.exit(1)
    // }

    // // Start project
    // log.info(
    //   `Starting new ${chalk.yellow(configs)} project: ${chalk.blue(name)}`
    // )
    // switch (configs) {
    //   case 'cra':
    //     await cra(name)
    //     break
    //   case 'gatsby': {
    //     await gatsby(name)
    //     break
    //   }
    //   case 'next':
    //     await next(name)
    //     break
    //   case 'react-native':
    //     await reactNative(name)
    //     break
    //   default:
    //     log.error(`Expected ${configs} to be one of: ${stacks.join(' ,')}`)
    //     process.exit(1)
    // }

    // // Add static type checking
    // log.info('Adding static type checking and base configuration')
    // await common(name)

    // // Post-template
    // switch (configs) {
    //   case 'cra':
    //     await postCra(name)
    //     break
    //   case 'gatsby': {
    //     await postGatsby(name)
    //     break
    //   }
    //   case 'next':
    //     await postNext(name)
    //     break
    //   case 'react-native':
    //     await postReactNative(name)
    //     break
    // }

    // // Apply variables
    // log.info('Parse project')
    // await parseProject(path.join(process.cwd(), name), { name })

    // // Git
    // log.info('Git')
    // await gitInit(name)

    // Install dependencies
    const packageManager = await getPackageManager()
    const installSpinner = log.step('Installing dependencies')
    await execa(packageManager, ['install'], { cwd: process.cwd() })
    installSpinner.succeed()

    log.success('Done! 🎉')
  }
}

export = SignificaStart
