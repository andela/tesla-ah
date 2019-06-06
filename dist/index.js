"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _routes = _interopRequireDefault(require("./api/routes"));

var _globalMiddleware = _interopRequireDefault(require("./middleware/globalMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var port = process.env.PORT || 3000;
var app = (0, _express["default"])();
(0, _globalMiddleware["default"])(app);
app.use('/api', _routes["default"]);
app.listen(port, function () {
  // eslint-disable-next-line no-console
  console.log("Server listening on port: ".concat(port, " in ").concat(process.env.NODE_ENV, " mode"));
});