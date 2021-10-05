"use strict";
(() => {
var exports = {};
exports.id = 598;
exports.ids = [598];
exports.modules = {

/***/ 769:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => (/* binding */ autenticado)
/* harmony export */ });
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(722);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);

const autenticado = fn => async (req, res) => {
  if (req.headers.authorization) {
    //esta pelo app
    (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify)(req.headers.authorization, String(process.env.JWT_SECRET), async function (err, decoded) {
      if (!err && decoded) return fn(req, res);
      return res.status(401).json({
        sucesso: false,
        mensagem: 'O token informado é inválido',
        erro: JSON.stringify(err)
      });
    });
  } else {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Não foi enviado um token'
    });
  }
};

/***/ }),

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

/***/ 193:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "cadastrar": () => (/* binding */ cadastrar)
/* harmony export */ });
/* harmony import */ var _lib_autenticado__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(769);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(841);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_autenticado__WEBPACK_IMPORTED_MODULE_0__/* .autenticado */ .b)(async function (req, res) {
  const metodo = req.method;

  switch (metodo) {
    case 'POST':
      cadastrar(req, res);
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
  }
}));
async function cadastrar(req, res) {
  const {
    nome
  } = req.body;

  try {
    //verificando se os campos foram fornecidos
    if (!nome) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'É necessário fornecer todos os dados'
      });
    }

    const grupo = await _lib_db__WEBPACK_IMPORTED_MODULE_1__/* .prisma.grupo.findUnique */ ._.grupo.findUnique({
      where: {
        nome
      }
    });

    if (grupo != null) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'O grupo já existe'
      });
    } else {
      const resultado = await _lib_db__WEBPACK_IMPORTED_MODULE_1__/* .prisma.grupo.create */ ._.grupo.create({
        data: {
          nome
        }
      }); //retornando o resultado

      return res.status(201).json({
        sucesso: true,
        mensagem: "Registro inserido com sucesso!",
        grupo: resultado
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Não conseguimos salvar o registro',
        erro: e.message
      });
    }
  }
}

/***/ }),

/***/ 722:
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(193));
module.exports = __webpack_exports__;

})();