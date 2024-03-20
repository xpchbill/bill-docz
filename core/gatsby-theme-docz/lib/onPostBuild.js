const { Plugin, parseConfig } = require('@bill-doc/core')

module.exports = async (params, opts = {}) => {
  const config = await parseConfig(opts)
  Plugin.runPluginsMethod(config.plugins)('onPreBuild')
}
