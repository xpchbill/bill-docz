process.setMaxListeners(Infinity)

import { Arguments } from 'yargs'
import path from 'path'

import { parseConfig } from '../config/doc'
import { getIsFirstInstall, getIsDocRepo } from '../bundler/machine/actions'
import { ensureDirs, createResources } from '../bundler/machine/services'
import { copyDocRc } from '../bundler/machine/services/create-resources'
import * as paths from '../config/paths'

export const init = async (args: Arguments<any>) => {
  copyDocRc(args.config)
  const docrcFilepath = path.join(paths.doc, 'docrc.js')
  const config = await parseConfig(args)
  const isFirstInstall = getIsFirstInstall()
  const isDocRepo = getIsDocRepo()
  await ensureDirs()
  const serverMachineContext = {
    args: config,
    isDocRepo,
    firstInstall: isFirstInstall,
    docrcFilepath,
  }
  await createResources(serverMachineContext)
}
