"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeCode = exports.removeTags = exports.propFromElement = exports.componentName = void 0;
var jsxUtils = _interopRequireWildcard(require("jsx-ast-utils"));
var _stripIndent = _interopRequireDefault(require("strip-indent"));
var _jsStringEscape = _interopRequireDefault(require("js-string-escape"));
var _ast = require("./ast");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const propFromElement = prop => (0, _ast.valueFromTraverse)(p => p.isJSXOpeningElement(), p => jsxUtils.getPropValue(jsxUtils.getProp(p.node.attributes, prop)));
exports.propFromElement = propFromElement;
const getTagContentsRange = (0, _ast.valueFromTraverse)(p => p.isJSXElement(), ({
  node
}) => {
  if (!node.closingElement) {
    // if the JSX element doesn't have a closingElement, it's because it's self-closed
    // and thus does not have any content: <Playground />
    return null;
  }
  return [node.openingElement.end, node.closingElement.start];
});
const removeTags = code => {
  const [start, end] = getTagContentsRange(code) || [0, 0];
  return code.slice(start, end);
};
exports.removeTags = removeTags;
const sanitizeCode = code => {
  const trimmed = (0, _stripIndent.default)(code).trim();
  const newCode = trimmed.startsWith('{') && trimmed.endsWith('}') ? trimmed.substr(1, trimmed.length - 2).trim() : trimmed;

  // return strip(newCode)
  return (0, _jsStringEscape.default)((0, _stripIndent.default)(newCode));
};
exports.sanitizeCode = sanitizeCode;
const componentName = value => {
  const match = value.match(/^\<\\?(\w+)/);
  return match && match[1];
};
exports.componentName = componentName;