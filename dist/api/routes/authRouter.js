"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _auth = _interopRequireDefault(require("../controllers/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var authRouter = (0, _express.Router)();
var signup = _auth["default"].signup;
authRouter.post('/signup', signup);
var _default = authRouter;
exports["default"] = _default;