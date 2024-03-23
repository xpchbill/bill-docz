const { setArgs, parseConfig, getBaseConfig } = require('@bill-doc/builder');
const yargs = require('yargs');

const getDocConfig = (opts) => {
  const { argv } = setArgs(yargs);
  return getBaseConfig(argv, opts);
};

exports.parseConfig = async (opts) => parseConfig(getDocConfig(opts));
exports.getDocConfig = getDocConfig;
