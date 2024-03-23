import sh from 'shelljs';
import { Arguments } from 'yargs';

import * as paths from '../config/paths';
import { spawnSync } from '../utils/spawn';
import { parseConfig } from '../config/doc';

export const serve = async (args: Arguments<any>) => {
  const config = await parseConfig(args);
  const cliArgs = ['run', 'serve'];

  if (config.port) {
    cliArgs.push('--');
    // Append gatsby option `port` to CLI args
    // https://www.gatsbyjs.org/docs/cheat-sheet/#cheat_sheet-text
    cliArgs.push('--port');
    cliArgs.push(String(config.port));
  }

  if (config.host) {
    // Append gatsby option `host` to CLI args
    // https://www.gatsbyjs.org/docs/cheat-sheet/#cheat_sheet-text
    cliArgs.push('--host');
    cliArgs.push(String(config.host));
  }

  sh.cd(paths.doc);
  spawnSync('npm', cliArgs);
};
