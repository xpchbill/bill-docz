const { Plugin, parseConfig } = require('@bill-doc/builder');

module.exports = async (params, opts = {}) => {
  const config = await parseConfig(opts);
  Plugin.runPluginsMethod(config.plugins)('onPreBuild');
};
