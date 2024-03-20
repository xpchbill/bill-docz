"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseMdx = exports.headingsFromAst = exports.getParsedData = void 0;
var _toVfile = _interopRequireDefault(require("to-vfile"));
var _unified = _interopRequireDefault(require("unified"));
var _remarkParse = _interopRequireDefault(require("remark-parse"));
var _remarkFrontmatter = _interopRequireDefault(require("remark-frontmatter"));
var _remarkSlug = _interopRequireDefault(require("remark-slug"));
var _remarkParseYaml = _interopRequireDefault(require("remark-parse-yaml"));
var _unistUtilFind = _interopRequireDefault(require("unist-util-find"));
var _unistUtilVisit = _interopRequireDefault(require("unist-util-visit"));
var _humanizeString = _interopRequireDefault(require("humanize-string"));
var _flatten = _interopRequireDefault(require("lodash/flatten"));
var _get = _interopRequireDefault(require("lodash/get"));
const parseMdx = (file, plugins) => {
  const raw = _toVfile.default.readSync(file, 'utf-8');
  const parser = (0, _unified.default)().use(_remarkParse.default, {
    type: 'yaml',
    marker: '-'
  }).use(_remarkFrontmatter.default).use(_remarkParseYaml.default).use(_remarkSlug.default);
  for (const plugin of plugins) {
    const [item, opts = {}] = Array.isArray(plugin) ? plugin : [plugin];
    parser.use(item, opts);
  }
  return parser.run(parser.parse(raw));
};
exports.parseMdx = parseMdx;
const getChildValue = children => children.map(child => child.children ? getChildValue(child.children) : child.value);
const valueFromHeading = node => {
  const children = (0, _get.default)(node, 'children');
  const slug = (0, _get.default)(node, 'data.id');
  if (Array.isArray(children)) {
    return (0, _flatten.default)(getChildValue(children)).filter(Boolean).join(' ');
  }
  return (0, _humanizeString.default)(slug);
};
function extractAst(callback, type) {
  return ast => {
    const results = [];
    (0, _unistUtilVisit.default)(ast, type, node => {
      results.push(callback(node));
    });
    return results;
  };
}
const headingsFromAst = exports.headingsFromAst = extractAst(node => ({
  slug: (0, _get.default)(node, 'data.id'),
  depth: (0, _get.default)(node, 'depth'),
  value: valueFromHeading(node)
}), 'heading');
const getParsedData = ast => {
  const node = (0, _unistUtilFind.default)(ast, {
    type: 'yaml'
  });
  return (0, _get.default)(node, `data.parsedValue`) || {};
};
exports.getParsedData = getParsedData;