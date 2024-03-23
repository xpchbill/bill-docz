process.setMaxListeners(Infinity);

import { Arguments } from 'yargs';
import logger from 'signale';

import { parseConfig } from '../config/doc';
import { bundler as gatsby } from '../bundler';
import { copyDocRc } from '../bundler/machine/services/create-resources';

export const dev = async (args: Arguments<any>) => {
  copyDocRc(args.config);
  const config = await parseConfig(args);
  const bundler = gatsby(config);
  const app = await bundler.createApp();

  try {
    await app.start();
  } catch (err: any) {
    logger.fatal('Failed to process data server');
    logger.error(err);
    process.exit(1);
  }
};
