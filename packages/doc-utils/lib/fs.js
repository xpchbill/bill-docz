"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touch = exports.compiled = void 0;
var path = _interopRequireWildcard(require("path"));
var fs = _interopRequireWildcard(require("fs-extra"));
var _artTemplate = require("art-template");
var _format = require("./format");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const touch = (file, raw) => new Promise(async (resolve, reject) => {
  const content = /jsx?$/.test(path.extname(file)) ? await (0, _format.format)(raw) : raw;
  const stream = fs.createWriteStream(file);
  stream.write(content, 'utf-8');
  stream.on('finish', e => resolve(e));
  stream.on('error', err => reject(err));
  stream.end();
});
exports.touch = touch;
const compiled = (file, opts = {}) => {
  const raw = fs.readFileSync(file, {
    encoding: 'utf-8'
  });
  return (0, _artTemplate.compile)(raw, opts);
};
exports.compiled = compiled;