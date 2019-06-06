"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _authRouter = _interopRequireDefault(require("./authRouter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var api = (0, _express["default"])(); // Routers go here

api.use('/auth', _authRouter["default"]);
var _default = api;
exports["default"] = _default;