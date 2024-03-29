import * as path from 'path';
import * as fs from 'fs-extra';
import { assign, Event } from 'xstate';
import { assoc } from 'lodash/fp';
import glob from 'fast-glob';
import log from 'signale';
import sh from 'shelljs';

import * as paths from '../../config/paths';
import { ServerMachineCtx } from './context';
import { copyDocRc } from './services/create-resources';

const ensureFile = (filename: string, toDelete?: string) => {
  const ghost = path.resolve(paths.doc, toDelete || filename);
  const original = path.resolve(paths.root, filename);
  if (fs.pathExistsSync(ghost) && !fs.pathExistsSync(original)) {
    fs.removeSync(ghost);
  }
};

export const ensureFiles = ({ args }: ServerMachineCtx) => {
  // themesDir defaults to "src" to behave like a normal gatsby site
  const appPath = path.join(paths.root, args.themesDir);
  const themeNames = glob.sync('bill-doc-theme-**', {
    cwd: appPath,
    onlyDirectories: true,
  });
  themeNames.forEach(themeName => {
    fs.copySync(
      path.join(appPath, themeName),
      path.join(paths.doc, 'src', themeName),
    );
  });
  const userPagesPath = path.join(appPath, 'pages');
  const docPagesPath = path.join(paths.doc, 'src', 'pages');
  // Copy 404 and other possible Gatsby pages
  if (fs.existsSync(userPagesPath)) {
    fs.copySync(userPagesPath, docPagesPath);
  }

  copyDocRc(args.config);
  ensureFile('gatsby-browser.js');
  ensureFile('gatsby-ssr.js');
  ensureFile('gatsby-node.js');
  ensureFile('gatsby-config.js', 'gatsby-config.custom.js');

  const publicPath = path.join(paths.doc, '..', args.public);
  if (fs.existsSync(publicPath)) {
    const destinationPath = path.join(paths.doc, 'static', args.public);
    try {
      fs.copySync(publicPath, destinationPath);
    } catch (err: any) {
      console.log(
        `Failed to copy static assets from ${publicPath} to ${destinationPath} : ${err.message}`,
      );
    }
  }
};

export const getIsFirstInstall = () => {
  return !sh.test('-e', path.join(paths.doc, 'package.json'));
};
export const getIsDocRepo = () => {
  return sh.test('-e', path.join(paths.root, '../../core'));
};

export const assignFirstInstall = assign((ctx: ServerMachineCtx) => {
  const firstInstall = getIsFirstInstall();
  return assoc('firstInstall', firstInstall, ctx);
});

export const checkIsDocRepo = assign((ctx: ServerMachineCtx) => {
  const isDocRepo = getIsDocRepo();
  return assoc('isDocRepo', isDocRepo, ctx);
});

export const logError = (ctx: ServerMachineCtx, ev: Event<any>) => {
  log.fatal(ev.data);
  sh.exit(0);
};
