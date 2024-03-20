"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImportsVariables = exports.getFullImports = void 0;
var parser = _interopRequireWildcard(require("@babel/parser"));
var generator = _interopRequireWildcard(require("@babel/generator"));
var _traverse = _interopRequireDefault(require("@babel/traverse"));
var _get = _interopRequireDefault(require("lodash/get"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const fromSpecifiers = (specifiers = []) => Array.isArray(specifiers) && specifiers.length > 0 ? specifiers.map(specifier => (0, _get.default)(specifier, 'local.name')) : [];
const traverseOnImports = fn => node => {
  try {
    const ast = parser.parse(node.value, {
      sourceType: 'module'
    });
    let populated = [];
    (0, _traverse.default)(ast, {
      enter(path) {
        if (path.isImportDeclaration()) {
          populated = populated.concat(fn(path));
          return;
        }
      }
    });
    return populated;
  } catch (err) {
    return [];
  }
};
const getFullImports = exports.getFullImports = traverseOnImports(path => [(0, _get.default)(generator.default(path.node), 'code')]);
const getImportsVariables = exports.getImportsVariables = traverseOnImports(path => fromSpecifiers(path.node.specifiers));