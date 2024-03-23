import * as fs from 'fs';
import * as path from 'path';
import * as resolve from 'resolve';

import { Config } from './argv';

export const ensureSlash = (filepath: any, needsSlash: boolean) => {
  const hasSlash = filepath.endsWith('/');

  if (hasSlash && !needsSlash) {
    return filepath.substr(filepath, filepath.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${filepath}/`;
  } else {
    return filepath;
  }
};

export const root = fs.realpathSync(process.cwd());
const IS_DOC_PROJECT = path.parse(root).base === '.doc';

export const resolveApp = (to: string) =>
  path.resolve(root, IS_DOC_PROJECT ? '../' : './', to);

export const checkIsDocProject = (config: Config) => {
  return path.parse(config.root || root).base === '.doc';
};

export const getRootDir = (config: Config) => {
  const isDocProject = checkIsDocProject(config);
  return isDocProject ? path.resolve(root, '../') : root;
};

export const getThemesDir = (config: Config) => {
  // resolve normalizes the new path and removes trailing slashes
  return path.resolve(path.join(getRootDir(config), config.themesDir));
};

export interface Paths {
  root: string
  templates: string
  servedPath: (base: string) => string

  doc: string
  app: string
  cache: string
  appPackageJson: string
  gatsbyConfig: string
  gatsbyBrowser: string
  gatsbyNode: string
  gatsbySSR: string

  checkIsDocProject: (config: any) => boolean
  getRootDir: (config: any) => string
  getThemesDir: (config: any) => string
  getDist: (dest: string) => string
  distPublic: (dest: string) => string

  importsJs: string
  rootJs: string
  indexJs: string
  indexHtml: string
  db: string
}

export const templates = path.join(resolve.sync('@bill-doc/builder'), '../templates');

export const servedPath = (base: string) => ensureSlash(base, true);

export const doc = resolveApp('.doc');
export const cache = path.resolve(doc, '.cache/');
export const app = path.resolve(doc, 'app/');
export const appPackageJson = resolveApp('package.json');
export const appTsConfig = resolveApp('tsconfig.json');
export const gatsbyConfig = resolveApp('gatsby-config.js');
export const gatsbyBrowser = resolveApp('gatsby-browser.js');
export const gatsbyNode = resolveApp('gatsby-node.js');
export const gatsbySSR = resolveApp('gatsby-ssr.js');

export const getDist = (dest: string) => path.join(root, dest);
export const distPublic = (dest: string) => path.join(dest, 'public/');

export const importsJs = path.resolve(app, 'imports.js');
export const rootJs = path.resolve(app, 'root.jsx');
export const indexJs = path.resolve(app, 'index.jsx');
export const indexHtml = path.resolve(app, 'index.html');
export const db = path.resolve(app, 'db.json');
