module.exports = {
  presets: [["babel-preset-gatsby-package", { esm: true }]],
  plugins: ["@babel/plugin-transform-modules-commonjs", "@babel/plugin-syntax-dynamic-import"],
}
