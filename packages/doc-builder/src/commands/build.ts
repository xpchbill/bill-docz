import { Arguments } from 'yargs';
import * as logger from 'signale';

import { parseConfig } from '../config/doc';
import { bundler as gatsby } from '../bundler';
import { init } from './init';
import { copyDocRc } from '../bundler/machine/services/create-resources';

export const build = async (args: Arguments<any>) => {
  copyDocRc(args.config);
  const config = await parseConfig(args);
  const bundler = gatsby(config);

  try {
    await init(args);
  } catch (err: any) {
    logger.error(`Failed to initialize doc : ${err.message}`);
  }

  try {
    await bundler.build();
  } catch (err: any) {
    logger.error(err);
    process.exit(1);
  }
};
