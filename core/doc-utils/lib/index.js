"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  get: true,
  mergeWith: true,
  format: true
};
Object.defineProperty(exports, "format", {
  enumerable: true,
  get: function () {
    return _format.format;
  }
});
Object.defineProperty(exports, "get", {
  enumerable: true,
  get: function () {
    return _get2.default;
  }
});
Object.defineProperty(exports, "mergeWith", {
  enumerable: true,
  get: function () {
    return _mergeWith2.default;
  }
});
var _get2 = _interopRequireDefault(require("lodash/get"));
var _mergeWith2 = _interopRequireDefault(require("lodash/fp/mergeWith"));
var _ast = require("./ast");
Object.keys(_ast).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _ast[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ast[key];
    }
  });
});
var _fs = require("./fs");
Object.keys(_fs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _fs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _fs[key];
    }
  });
});
var _imports = require("./imports");
Object.keys(_imports).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _imports[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _imports[key];
    }
  });
});
var _exports = require("./exports");
Object.keys(_exports).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _exports[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _exports[key];
    }
  });
});
var _jsx = require("./jsx");
Object.keys(_jsx).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _jsx[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _jsx[key];
    }
  });
});
var _mdast = require("./mdast");
Object.keys(_mdast).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mdast[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mdast[key];
    }
  });
});
var _format = require("./format");