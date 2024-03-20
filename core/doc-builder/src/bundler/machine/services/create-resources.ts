import * as path from 'path'
import * as fs from 'fs-extra'
import { omit } from 'lodash/fp'

import * as paths from '../../../config/paths'
import { ServerMachineCtx } from '../context'
import { outputFileFromTemplate } from '../../../utils/template'

export const copyDocRc = (configPath?: string) => {
  const sourceDocRc = configPath
    ? path.join(paths.root, configPath)
    : path.join(paths.root, 'docrc.js')

  const hasDocRc = fs.existsSync(sourceDocRc)
  if (!hasDocRc) return

  const destinationDocRc = path.join(paths.doc, 'docrc.js')
  try {
    fs.copySync(sourceDocRc, destinationDocRc)
  } catch (err: any) {}
}

const copyAndModifyPkgJson = async (ctx: ServerMachineCtx) => {
  const movePath = path.join(paths.doc, 'package.json')
  // const pkg = await fs.readJSON(filepath, { throws: false })
  const newPkg = {
    name: 'doc-app',
    license: 'MIT',
    dependencies: {
      gatsby: 'just-to-fool-cli-never-installed',
    },
    scripts: {
      dev: 'gatsby develop',
      build: 'gatsby build',
      serve: 'gatsby serve',
    },
    ...(ctx.isDocRepo && {
      private: true,
      workspaces: ['../../../core/**', '../../../other-packages/**'],
    }),
  }
  await fs.outputJSON(movePath, newPkg, { spaces: 2 })
}

const writeEslintRc = async () => {
  const possibleFilenames = [
    '.eslintrc.js',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
    '.eslintrc',
  ]
  for (const filename of possibleFilenames) {
    const filepath = path.join(paths.root, filename)
    const dest = path.join(paths.doc, filename)
    if (fs.pathExistsSync(filepath)) {
      await fs.copy(filepath, dest)
      return
    }
  }
}

const copyDotEnv = () => {
  const filename = '.env'
  const filepath = path.join(paths.root, filename)
  const dest = path.join(paths.doc, filename)

  if (fs.pathExistsSync(filepath)) {
    fs.copySync(filepath, dest)
  }
}

const copyEslintIgnore = async () => {
  const filename = '.eslintignore'
  const filepath = path.join(paths.root, filename)
  const dest = path.join(paths.doc, filename)

  if (fs.pathExistsSync(filepath)) {
    await fs.copy(filepath, dest)
  }
}

export const writeDefaultNotFound = async () => {
  const outputPath = path.join(paths.doc, 'src/pages/404.js')
  // If it exists then it would have been created in ensureFiles while copying the theme
  if (fs.existsSync(outputPath)) return
  await outputFileFromTemplate('404.tpl.js', outputPath, {})
}

const writeGatsbyConfig = async ({ args, isDocRepo }: ServerMachineCtx) => {
  const outputPath = path.join(paths.doc, 'gatsby-config.js')
  const config = omit(['plugins'], args)
  const newConfig = {
    ...config,
    root: paths.doc,
  }

  await outputFileFromTemplate('gatsby-config.tpl.js', outputPath, {
    isDocRepo,
    config: newConfig,
    opts: JSON.stringify(newConfig),
  })
}

const writeGatsbyConfigNode = async () => {
  const outputPath = path.join(paths.doc, 'gatsby-node.js')
  await outputFileFromTemplate('gatsby-node.tpl.js', outputPath)
}

const copyGatsbyConfigFile = async (from: string, to: string) => {
  const filepath = path.join(paths.root, from)
  const dest = path.join(paths.doc, to)
  if (fs.pathExistsSync(filepath)) {
    await fs.copy(filepath, dest)
  }
}

const writeGatsbyConfigCustom = async () =>
  copyGatsbyConfigFile('gatsby-config.js', 'gatsby-config.custom.js')

const writeGatsbyNodeCustom = async () =>
  copyGatsbyConfigFile('gatsby-node.js', 'gatsby-node.custom.js')

const writeGatsbySSR = async () =>
  copyGatsbyConfigFile('gatsby-ssr.js', 'gatsby-ssr.js')

const writeGatsbyBrowser = async () =>
  copyGatsbyConfigFile('gatsby-browser.js', 'gatsby-browser.js')

export const createResources = async (ctx: ServerMachineCtx) => {
  try {
    copyDocRc(ctx.args.config)
    copyDotEnv()
    await copyAndModifyPkgJson(ctx)
    await writeEslintRc()
    await copyEslintIgnore()
    await writeDefaultNotFound()
    await writeGatsbyConfig(ctx)
    await writeGatsbyConfigNode()
    await writeGatsbyConfigCustom()
    await writeGatsbyNodeCustom()
    await writeGatsbyBrowser()
    await writeGatsbySSR()
  } catch (err: any) {
    console.error(err)
  }
}
