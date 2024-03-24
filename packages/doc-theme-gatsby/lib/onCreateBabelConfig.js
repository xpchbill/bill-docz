const { Plugin, parseConfig } = require('@bill-doc/doc-builder');

module.exports = async (params, opts = {}) => {
  const config = await parseConfig(opts);
  const run = Plugin.runPluginsMethod(config.plugins);

  const { paths } = config;
  const { actions, stage } = params;

  actions.setBabelPlugin({
    name: '@bill-doc/doc-babel-plugin-export-metadata',
    options: {
      root: paths.getRootDir(config),
    },
  });

  run('onCreateBabelConfig', params, stage === 'develop');
};
