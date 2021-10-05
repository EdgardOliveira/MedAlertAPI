"use strict";
(() => {
var exports = {};
exports.id = 870;
exports.ids = [870];
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

/***/ 694:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "cadastrar": () => (/* binding */ cadastrar)
/* harmony export */ });
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(773);
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(841);
/* harmony import */ var _lib_autenticado__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(769);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_autenticado__WEBPACK_IMPORTED_MODULE_2__/* .autenticado */ .b)(async function (req, res) {
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
  const medico = req.body;

  try {
    //verificando se foram fornecidos os dados
    if (!medico) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'É necessário fornecer todos os dados'
      });
    } //verificando se o paciente já existe


    const consulta = await _lib_db__WEBPACK_IMPORTED_MODULE_1__/* .prisma.medico.findUnique */ ._.medico.findUnique({
      where: {
        crm: medico.crm
      }
    });

    if (!consulta) {
      //usuário não existe... criptografa a senha e cadastra no banco de dados
      const resultado = await _lib_db__WEBPACK_IMPORTED_MODULE_1__/* .prisma.medico.create */ ._.medico.create({
        data: {
          crm: medico.crm,
          especialidade: {
            connectOrCreate: {
              where: {
                nome: medico.especialidade
              },
              create: {
                nome: medico.especialidade
              }
            }
          },
          usuario: {
            connectOrCreate: {
              where: {
                email: medico.usuario.email
              },
              create: {
                nome: medico.usuario.nome,
                email: medico.usuario.email,
                senha: (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.hashSync)(medico.usuario.senha, 12),
                grupo: {
                  connectOrCreate: {
                    where: {
                      nome: medico.usuario.grupo
                    },
                    create: {
                      nome: medico.usuario.grupo
                    }
                  }
                }
              }
            }
          }
        }
      }); //retornando o resultado

      res.status(201).json({
        sucesso: true,
        mensagem: "Registro inserido com sucesso!",
        medico: resultado
      });
    } else {
      res.status(200).json({
        sucesso: true,
        mensagem: "Médico já possui cadastro!",
        medico: consulta
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Não conseguimos salvar o registro',
        erro: e.message
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
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(694));
module.exports = __webpack_exports__;

})();