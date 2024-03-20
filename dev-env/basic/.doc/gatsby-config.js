const { mergeWith } = require('@bill-doc/doc-utils')
const fs = require('fs-extra')
const path = require('path')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Dev Env Basic',
    description: 'My awesome app using doc',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-doc',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root: '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/.doc',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.doc/dist',
        d: '.doc/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Dev Env Basic',
        description: 'My awesome app using doc',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          app: '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/.doc/app',
          appPackageJson:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/package.json',
          appTsConfig:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/tsconfig.json',
          cache:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/.doc/.cache',
          db: '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/.doc/app/db.json',
          doc: '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/.doc',
          gatsbyBrowser:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/gatsby-browser.js',
          gatsbyConfig:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/gatsby-config.js',
          gatsbyNode:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/gatsby-node.js',
          gatsbySSR:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/gatsby-ssr.js',
          importsJs:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/.doc/app/imports.js',
          indexHtml:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/.doc/app/index.html',
          indexJs:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/.doc/app/index.jsx',
          root: '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic',
          rootJs:
            '/Users/bxiong/workspace/gitlab/bill-docz/dev-env/basic/.doc/app/root.jsx',
          templates:
            '/Users/bxiong/workspace/gitlab/bill-docz/node_modules/@bill-doc/builder/dist/templates',
        },
      },
    },
    {
      resolve: 'gatsby-plugin-compile-es6-packages',
      options: {
        modules: [
          'doc',
          '@bill-doc/builder',
          'gatsby-theme-doc',
          'mdast-util-mdx',
          'mdast-util-to-markdown',
        ],
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
