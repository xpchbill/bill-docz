const { Plugin, parseConfig } = require('@bill-doc/doc-builder');

module.exports = async (params, opts = {}) => {
  const config = await parseConfig(opts);
  Plugin.runPluginsMethod(config.plugins)('onPreBuild');
};
