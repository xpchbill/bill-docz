import * as path from 'path';
import * as fs from 'fs-extra';
import * as paths from '../../../config/paths';

export const ensureDirs = async () => {
  await fs.ensureDir(paths.doc);
  return await fs.ensureDir(path.join(paths.doc, 'src/pages'));
};
