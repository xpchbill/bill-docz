const { Plugin, parseConfig } = require('@bill-doc/builder')

module.exports = async (params, opts = {}) => {
  const config = await parseConfig(opts)
  const run = Plugin.runPluginsMethod(config.plugins)
  const { stage } = params

  run('onCreateDevServer', params, stage === 'develop')
}
