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
      JSON.stringify(err)
    )
  }
}

const config = {
  <% if (config.base) {%>
  pathPrefix: "<%- config.base %>",
  <%}%>
  siteMetadata: {
    title: "<%- config.title %>",
    description: "<%- config.description %>"
  },
  plugins: [
    <% if (config.typescript) {%>
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true
      }
    },<%}%>
    {
      resolve: '@bill-doc/doc-theme-gatsby',
      options: <%- opts %>
    },<% if (isDocRepo) {%>
    {
      resolve: 'gatsby-plugin-compile-es6-packages',
      options: {
        modules: [
          'doc',
          '@bill-doc/doc-builder',
          '@bill-doc/doc-theme-gatsby',
        ],
      },
    },<%}%>
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
