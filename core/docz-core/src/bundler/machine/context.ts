import { Config } from '../../config/argv'

export interface ServerMachineCtx {
  args: Config
  docrcFilepath?: string
  firstInstall?: boolean
  isDocRepo?: boolean
}
