"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valueFromTraverse = exports.codeFromNode = void 0;
var parser = _interopRequireWildcard(require("@babel/parser"));
var _traverse = _interopRequireDefault(require("@babel/traverse"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const valueFromTraverse = (condition, predicate = p => p) => code => {
  let value = '';
  const ast = parser.parse(code, {
    plugins: ['jsx']
  });
  (0, _traverse.default)(ast, {
    enter(path) {
      if (condition(path)) {
        value = predicate(path);
        path.stop();
        return;
      }
    }
  });
  return value;
};
exports.valueFromTraverse = valueFromTraverse;
const codeFromNode = condition => code => valueFromTraverse(condition, p => code.slice(p.node.start, p.node.end))(code);
exports.codeFromNode = codeFromNode;