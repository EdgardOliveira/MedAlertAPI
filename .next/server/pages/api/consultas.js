"use strict";
(() => {
var exports = {};
exports.id = 593;
exports.ids = [593];
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

/***/ 621:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "obterTodas": () => (/* binding */ obterTodas)
/* harmony export */ });
/* harmony import */ var _lib_autenticado__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(769);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(722);
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(841);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_autenticado__WEBPACK_IMPORTED_MODULE_0__/* .autenticado */ .b)(async function (req, res) {
  const metodo = req.method;

  switch (metodo) {
    case 'GET':
      obterTodas(req, res);
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
  }
}));
async function obterTodas(req, res) {
  const token = req.headers.authorization;
  let usuarioId;

  try {
    if (!token) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Um token precisa ser fornecido'
      });
    } else {
      (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__.verify)(token, String(process.env.JWT_SECRET), function (err, decoded) {
        usuarioId = decoded === null || decoded === void 0 ? void 0 : decoded.sub;
      });
    }

    const paciente = await _lib_db__WEBPACK_IMPORTED_MODULE_2__/* .prisma.paciente.findUnique */ ._.paciente.findUnique({
      where: {
        usuarioId: usuarioId
      }
    }); //verificando se os campos foram fornecidos

    if (paciente == null) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'É necessário fornecer o id para recuperar os dados'
      });
    }

    const resultado = await _lib_db__WEBPACK_IMPORTED_MODULE_2__/* .prisma.consulta.findMany */ ._.consulta.findMany({
      where: {
        pacienteId: paciente.id
      },
      include: {
        empresa: {
          include: {
            endereco: {
              include: {
                bairro: {
                  include: {
                    cidade: {
                      include: {
                        ufs: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        medico: {
          include: {
            especialidade: true
          }
        },
        paciente: {
          include: {
            convenio: true,
            endereco: {
              include: {
                bairro: {
                  include: {
                    cidade: {
                      include: {
                        ufs: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        receita: {
          include: {
            medicamentos: true
          }
        }
      }
    });
    let feedback = {
      sucesso: false,
      mensagem: "",
      consultas: resultado
    };

    if (resultado != null) {
      feedback.sucesso = true;
      feedback.mensagem = "Registro recuperado com sucesso!";
    } else {
      feedback.sucesso = false;
      feedback.mensagem = `Nenhum registro de consultas para o paciente com id:${paciente.id} foi encontrado no banco de dados.`;
    }

    if (feedback.sucesso) {
      //retornando o resultado
      res.status(200).json(feedback);
    } else {
      res.status(404).json(feedback);
    }
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        sucesso: false,
        mensagem: 'Não conseguimos recuperar os registros',
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
var __webpack_exports__ = (__webpack_exec__(621));
module.exports = __webpack_exports__;

})();