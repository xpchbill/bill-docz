"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportsVariables = void 0;
var parser = _interopRequireWildcard(require("@babel/parser"));
var _traverse = _interopRequireDefault(require("@babel/traverse"));
var _get = _interopRequireDefault(require("lodash/get"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const fromDeclarations = (declarations = []) => Array.isArray(declarations) && declarations.length > 0 ? declarations.map(declaration => (0, _get.default)(declaration, 'id.name')) : [];
const traverseOnExports = fn => node => {
  try {
    const ast = parser.parse(node.value, {
      sourceType: 'module'
    });
    let populated = [];
    (0, _traverse.default)(ast, {
      enter(path) {
        if (path.isExportDeclaration()) {
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
const getExportsVariables = exports.getExportsVariables = traverseOnExports(path => {
  const type = (0, _get.default)(path, 'node.declaration.type');
  switch (type) {
    case 'VariableDeclaration':
      return fromDeclarations((0, _get.default)(path, 'node.declaration.declarations', []));
    case 'FunctionDeclaration':
      const declaration = (0, _get.default)(path, 'node.declaration', false);
      return fromDeclarations(declaration ? [declaration] : []);
    case 'Identifier':
      return (0, _get.default)(path, 'node.declaration.name');
    default:
      console.error(`Unexpected export type ${type} in @bill-doc/doc-utils/exports`);
  }
});