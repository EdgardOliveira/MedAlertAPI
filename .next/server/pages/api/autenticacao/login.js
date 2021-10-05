"use strict";
(() => {
var exports = {};
exports.id = 372;
exports.ids = [372];
exports.modules = {

/***/ 841:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "_": () => (/* binding */ prisma)
});

;// CONCATENATED MODULE: external "@prisma/client"
const client_namespaceObject = require("@prisma/client");
;// CONCATENATED MODULE: ./lib/db.ts

const prisma = global.prisma || new client_namespaceObject.PrismaClient({
  log: ['query']
});
if (false) {}

/***/ }),

/***/ 61:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Login)
/* harmony export */ });
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(773);
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(722);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(841);



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

    const usuario = await _lib_db__WEBPACK_IMPORTED_MODULE_2__/* .prisma.usuario.findUnique */ ._.usuario.findUnique({
      where: {
        email: email
      }
    });

    if (!usuario) {
      return await res.status(400).json({
        sucesso: false,
        mensagem: 'Credenciais inválidas',
        enviado: req
      });
    } else {
      (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.compare)(senha, usuario.senha, async function (err, result) {
        if (!err && result) {
          const claims = {
            sub: usuario.id,
            email: usuario.email
          };
          const jwt = (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__.sign)(claims, String(process.env.JWT_SECRET), {
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
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(405).json({
        sucesso: false,
        mensagem: "Ocorreu um erro ao tentar fazer login.",
        erro: e.message,
        req: req.body
      });
    }
  }
}

/***/ }),

/***/ 773:
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ 722:
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(61));
module.exports = __webpack_exports__;

})();