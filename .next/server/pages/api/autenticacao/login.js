"use strict";
(() => {
var exports = {};
exports.id = "pages/api/autenticacao/login";
exports.ids = ["pages/api/autenticacao/login"];
exports.modules = {

/***/ "./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "prisma": () => (/* binding */ prisma)
/* harmony export */ });
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ "@prisma/client");
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);

const prisma = global.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({
  log: ['query']
});
if (true) global.prisma = prisma;

/***/ }),

/***/ "./pages/api/autenticacao/login.ts":
/*!*****************************************!*\
  !*** ./pages/api/autenticacao/login.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Login),
/* harmony export */   "verificarCredenciais": () => (/* binding */ verificarCredenciais)
/* harmony export */ });
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bcryptjs */ "bcryptjs");
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/db */ "./lib/db.ts");



async function Login(req, res) {
  const metodo = req.method;

  switch (metodo) {
    case 'POST':
      verificarCredenciais(req, res);
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
  }
}
async function verificarCredenciais(req, res) {
  const {
    email,
    senha
  } = req.body;

  try {
    if (!email || !senha) {
      return await res.status(400).json({
        sucesso: false,
        mensagem: 'Preencha todos os campos obrigatórios.',
        enviado: req
      });
    }

    const usuario = await _lib_db__WEBPACK_IMPORTED_MODULE_2__.prisma.usuario.findUnique({
      where: {
        email: email
      }
    });
    (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.compare)(senha, usuario.senha, async function (err, result) {
      if (!err && result) {
        const claims = {
          sub: usuario.id,
          email: usuario.email
        };
        const jwt = (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__.sign)(claims, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        return res.status(200).json({
          sucesso: true,
          mensagem: 'Autenticado com sucesso!',
          token: jwt
        });
      } else {
        return res.status(401).json({
          sucesso: false,
          mensagem: "As credenciais fornecidas são inválidas",
          enviado: req.body
        });
      }
    });
  } catch (e) {
    return res.status(405).json({
      sucesso: false,
      mensagem: "Ocorreu um erro ao tentar fazer login.",
      erro: e.message,
      req: req.body
    });
  }
}

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/api/autenticacao/login.ts"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ1IsV0FBTzVCLEdBQUcsQ0FBQ0ssTUFBSixDQUFXLEdBQVgsRUFBZ0JLLElBQWhCLENBQXFCO0FBQ3hCQyxNQUFBQSxPQUFPLEVBQUUsS0FEZTtBQUV4QkMsTUFBQUEsUUFBUSxFQUFFLHdDQUZjO0FBR3hCaUIsTUFBQUEsSUFBSSxFQUFFRCxDQUFDLENBQUNFLE9BSGdCO0FBSXhCL0IsTUFBQUEsR0FBRyxFQUFFQSxHQUFHLENBQUNVO0FBSmUsS0FBckIsQ0FBUDtBQU1IO0FBQ0o7Ozs7Ozs7Ozs7QUM3REQ7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWVkYWxlcnRhcGkvLi9saWIvZGIudHMiLCJ3ZWJwYWNrOi8vbWVkYWxlcnRhcGkvLi9wYWdlcy9hcGkvYXV0ZW50aWNhY2FvL2xvZ2luLnRzIiwid2VicGFjazovL21lZGFsZXJ0YXBpL2V4dGVybmFsIFwiQHByaXNtYS9jbGllbnRcIiIsIndlYnBhY2s6Ly9tZWRhbGVydGFwaS9leHRlcm5hbCBcImJjcnlwdGpzXCIiLCJ3ZWJwYWNrOi8vbWVkYWxlcnRhcGkvZXh0ZXJuYWwgXCJqc29ud2VidG9rZW5cIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIHZhciBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcHJpc21hID1cclxuICAgIGdsb2JhbC5wcmlzbWEgfHxcclxuICAgIG5ldyBQcmlzbWFDbGllbnQoe1xyXG4gICAgICAgIGxvZzogWydxdWVyeSddLFxyXG4gICAgfSlcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWwucHJpc21hID0gcHJpc21hIiwiaW1wb3J0IHtOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlfSBmcm9tIFwibmV4dFwiO1xyXG5pbXBvcnQgeyBjb21wYXJlIH0gZnJvbSAnYmNyeXB0anMnO1xyXG5pbXBvcnQgeyBzaWduIH0gZnJvbSAnanNvbndlYnRva2VuJztcclxuaW1wb3J0IHsgcHJpc21hfSBmcm9tIFwiLi4vLi4vLi4vbGliL2RiXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBMb2dpbihyZXE6IE5leHRBcGlSZXF1ZXN0LCByZXM6IE5leHRBcGlSZXNwb25zZSkge1xyXG4gICAgY29uc3QgbWV0b2RvID0gcmVxLm1ldGhvZDtcclxuXHJcbiAgICBzd2l0Y2ggKG1ldG9kbykge1xyXG4gICAgICAgIGNhc2UgJ1BPU1QnOlxyXG4gICAgICAgICAgICB2ZXJpZmljYXJDcmVkZW5jaWFpcyhyZXEsIHJlcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FsbG93JywgWydQT1NUJ10pXHJcbiAgICAgICAgICAgIHJlcy5zdGF0dXMoNDA1KS5lbmQoYE3DqXRvZG86ICR7bWV0b2RvfSBuw6NvIMOpIHBlcm1pdGlkbyBwYXJhIGVzdGEgcm90YWApO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdmVyaWZpY2FyQ3JlZGVuY2lhaXMocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpIHtcclxuICAgIGNvbnN0IHtlbWFpbCwgc2VuaGF9ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBpZiAoIWVtYWlsIHx8ICFzZW5oYSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgcmVzLnN0YXR1cyg0MDApLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgc3VjZXNzbzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtZW5zYWdlbTogJ1ByZWVuY2hhIHRvZG9zIG9zIGNhbXBvcyBvYnJpZ2F0w7NyaW9zLicsXHJcbiAgICAgICAgICAgICAgICBlbnZpYWRvOiByZXEsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdXN1YXJpbyA9IGF3YWl0IHByaXNtYS51c3VhcmlvLmZpbmRVbmlxdWUoe1xyXG4gICAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbXBhcmUoc2VuaGEsIHVzdWFyaW8uc2VuaGEsIGFzeW5jIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xyXG4gICAgICAgICAgICBpZiAoIWVyciAmJiByZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNsYWltcyA9IHtzdWI6IHVzdWFyaW8uaWQsIGVtYWlsOiB1c3VhcmlvLmVtYWlsfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGp3dCA9IHNpZ24oY2xhaW1zLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVULCB7ZXhwaXJlc0luOiAnMWgnfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDApLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Vzc286IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVuc2FnZW06ICdBdXRlbnRpY2FkbyBjb20gc3VjZXNzbyEnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiBqd3RcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBzdWNlc3NvOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBtZW5zYWdlbTogXCJBcyBjcmVkZW5jaWFpcyBmb3JuZWNpZGFzIHPDo28gaW52w6FsaWRhc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGVudmlhZG86IHJlcS5ib2R5XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA1KS5qc29uKHtcclxuICAgICAgICAgICAgc3VjZXNzbzogZmFsc2UsXHJcbiAgICAgICAgICAgIG1lbnNhZ2VtOiBcIk9jb3JyZXUgdW0gZXJybyBhbyB0ZW50YXIgZmF6ZXIgbG9naW4uXCIsXHJcbiAgICAgICAgICAgIGVycm86IGUubWVzc2FnZSxcclxuICAgICAgICAgICAgcmVxOiByZXEuYm9keVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAcHJpc21hL2NsaWVudFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJiY3J5cHRqc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7Il0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsInByaXNtYSIsImdsb2JhbCIsImxvZyIsImNvbXBhcmUiLCJzaWduIiwiTG9naW4iLCJyZXEiLCJyZXMiLCJtZXRvZG8iLCJtZXRob2QiLCJ2ZXJpZmljYXJDcmVkZW5jaWFpcyIsInNldEhlYWRlciIsInN0YXR1cyIsImVuZCIsImVtYWlsIiwic2VuaGEiLCJib2R5IiwianNvbiIsInN1Y2Vzc28iLCJtZW5zYWdlbSIsImVudmlhZG8iLCJ1c3VhcmlvIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiZXJyIiwicmVzdWx0IiwiY2xhaW1zIiwic3ViIiwiaWQiLCJqd3QiLCJwcm9jZXNzIiwiZW52IiwiSldUX1NFQ1JFVCIsImV4cGlyZXNJbiIsInRva2VuIiwiZSIsImVycm8iLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==