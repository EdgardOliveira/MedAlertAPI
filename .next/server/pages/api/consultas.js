"use strict";
(() => {
var exports = {};
exports.id = "pages/api/consultas";
exports.ids = ["pages/api/consultas"];
exports.modules = {

/***/ "./lib/autenticado.ts":
/*!****************************!*\
  !*** ./lib/autenticado.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autenticado": () => (/* binding */ autenticado)
/* harmony export */ });
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);

const autenticado = fn => async (req, res) => {
  if (req.headers.authorization) {
    //esta pelo app
    (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__.verify)(req.headers.authorization, process.env.JWT_SECRET, async function (err, decoded) {
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

/***/ "./pages/api/consultas/index.ts":
/*!**************************************!*\
  !*** ./pages/api/consultas/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "obterTodas": () => (/* binding */ obterTodas)
/* harmony export */ });
/* harmony import */ var _lib_autenticado__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/autenticado */ "./lib/autenticado.ts");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");
/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../lib/db */ "./lib/db.ts");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_autenticado__WEBPACK_IMPORTED_MODULE_0__.autenticado)(async function Consultas(req, res) {
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
  (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_1__.verify)(token, process.env.JWT_SECRET, function (err, decoded) {
    usuarioId = decoded.sub;
  });
  const paciente = await _lib_db__WEBPACK_IMPORTED_MODULE_2__.prisma.paciente.findUnique({
    where: {
      usuarioId: usuarioId
    }
  });
  console.log(`paciente:\n${JSON.stringify(paciente, null, 4)}`);

  try {
    //verificando se os campos foram fornecidos
    if (paciente == null) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'É necessário fornecer o id para recuperar os dados'
      });
    }

    const resultado = await _lib_db__WEBPACK_IMPORTED_MODULE_2__.prisma.consulta.findMany({
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
  } finally {
    res.end();
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
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/api/consultas/index.ts"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFIUyxPQUFyQjtBQUtIO0FBQ0osR0EzRkQsU0EyRlU7QUFDTnBELElBQUFBLEdBQUcsQ0FBQ3dCLEdBQUo7QUFDSDtBQUNKOzs7Ozs7Ozs7O0FDaklEOzs7Ozs7Ozs7O0FDQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZWRhbGVydGFwaS8uL2xpYi9hdXRlbnRpY2Fkby50cyIsIndlYnBhY2s6Ly9tZWRhbGVydGFwaS8uL2xpYi9kYi50cyIsIndlYnBhY2s6Ly9tZWRhbGVydGFwaS8uL3BhZ2VzL2FwaS9jb25zdWx0YXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWVkYWxlcnRhcGkvZXh0ZXJuYWwgXCJAcHJpc21hL2NsaWVudFwiIiwid2VicGFjazovL21lZGFsZXJ0YXBpL2V4dGVybmFsIFwianNvbndlYnRva2VuXCIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHt2ZXJpZnl9IGZyb20gJ2pzb253ZWJ0b2tlbic7XHJcbmltcG9ydCB7TmV4dEFwaUhhbmRsZXIsIE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2V9IGZyb20gJ25leHQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGF1dGVudGljYWRvID0gKGZuOiBOZXh0QXBpSGFuZGxlcikgPT4gYXN5bmMgKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlLCkgPT4ge1xyXG4gICAgaWYgKHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24hKSB7XHJcbiAgICAgICAgLy9lc3RhIHBlbG8gYXBwXHJcbiAgICAgICAgdmVyaWZ5KHJlcS5oZWFkZXJzLmF1dGhvcml6YXRpb24hLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVULCAoYXN5bmMgZnVuY3Rpb24gKGVyciwgZGVjb2RlZCkge1xyXG4gICAgICAgICAgICBpZiAoIWVyciAmJiBkZWNvZGVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKHJlcSwgcmVzKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7XHJcbiAgICAgICAgICAgICAgICBzdWNlc3NvOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIG1lbnNhZ2VtOiAnTyB0b2tlbiBpbmZvcm1hZG8gw6kgaW52w6FsaWRvJyxcclxuICAgICAgICAgICAgICAgIGVycm86IEpTT04uc3RyaW5naWZ5KGVyciksXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7XHJcbiAgICAgICAgICAgIHN1Y2Vzc286IGZhbHNlLFxyXG4gICAgICAgICAgICBtZW5zYWdlbTogJ07Do28gZm9pIGVudmlhZG8gdW0gdG9rZW4nXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07IiwiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICB2YXIgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWRcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHByaXNtYSA9XHJcbiAgICBnbG9iYWwucHJpc21hIHx8XHJcbiAgICBuZXcgUHJpc21hQ2xpZW50KHtcclxuICAgICAgICBsb2c6IFsncXVlcnknXSxcclxuICAgIH0pXHJcblxyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsLnByaXNtYSA9IHByaXNtYSIsImltcG9ydCB7TmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZX0gZnJvbSBcIm5leHRcIjtcclxuaW1wb3J0IHsgYXV0ZW50aWNhZG8gfSBmcm9tIFwiLi4vLi4vLi4vbGliL2F1dGVudGljYWRvXCI7XHJcbmltcG9ydCB7IHZlcmlmeSB9IGZyb20gXCJqc29ud2VidG9rZW5cIjtcclxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIi4uLy4uLy4uL2xpYi9kYlwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYXV0ZW50aWNhZG8oYXN5bmMgZnVuY3Rpb24gQ29uc3VsdGFzKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XHJcbiAgICBjb25zdCBtZXRvZG8gPSByZXEubWV0aG9kO1xyXG5cclxuICAgIHN3aXRjaCAobWV0b2RvKSB7XHJcbiAgICAgICAgY2FzZSAnR0VUJzpcclxuICAgICAgICAgICAgb2J0ZXJUb2RhcyhyZXEsIHJlcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0FsbG93JywgWydHRVQnXSlcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDUpLmVuZChgTcOpdG9kbzogJHttZXRvZG99IG7Do28gw6kgcGVybWl0aWRvIHBhcmEgZXN0YSByb3RhYCk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9idGVyVG9kYXMocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UpIHtcclxuICAgIGNvbnN0IHRva2VuID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbjtcclxuXHJcbiAgICBsZXQgdXN1YXJpb0lkOiBzdHJpbmc7XHJcblxyXG4gICAgdmVyaWZ5KHRva2VuLCBwcm9jZXNzLmVudi5KV1RfU0VDUkVULCBmdW5jdGlvbihlcnIsIGRlY29kZWQpIHtcclxuICAgICAgICB1c3VhcmlvSWQgPSBkZWNvZGVkLnN1YjtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHBhY2llbnRlID0gYXdhaXQgcHJpc21hLnBhY2llbnRlLmZpbmRVbmlxdWUoe1xyXG4gICAgICAgIHdoZXJlOiB7XHJcbiAgICAgICAgICAgIHVzdWFyaW9JZDogdXN1YXJpb0lkXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc29sZS5sb2coYHBhY2llbnRlOlxcbiR7SlNPTi5zdHJpbmdpZnkocGFjaWVudGUsIG51bGwsIDQpfWApXHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICAvL3ZlcmlmaWNhbmRvIHNlIG9zIGNhbXBvcyBmb3JhbSBmb3JuZWNpZG9zXHJcbiAgICAgICAgaWYgKHBhY2llbnRlID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Vzc286IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbWVuc2FnZW06ICfDiSBuZWNlc3PDoXJpbyBmb3JuZWNlciBvIGlkIHBhcmEgcmVjdXBlcmFyIG9zIGRhZG9zJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0YWRvID0gYXdhaXQgcHJpc21hLmNvbnN1bHRhLmZpbmRNYW55KHtcclxuICAgICAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgICAgIHBhY2llbnRlSWQ6IHBhY2llbnRlLmlkXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGluY2x1ZGU6IHtcclxuICAgICAgICAgICAgICAgIGVtcHJlc2E6IHtcclxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZGVyZWNvOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFpcnJvOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpZGFkZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdWZzOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZWRpY286IHtcclxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVzcGVjaWFsaWRhZGU6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBhY2llbnRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb252ZW5pbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kZXJlY286IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWlycm86IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2lkYWRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1ZnM6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgcmVjZWl0YToge1xyXG4gICAgICAgICAgICAgICAgICAgIGluY2x1ZGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVkaWNhbWVudG9zOiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBmZWVkYmFjayA9IHtcclxuICAgICAgICAgICAgc3VjZXNzbzogZmFsc2UsXHJcbiAgICAgICAgICAgIG1lbnNhZ2VtOiBcIlwiLFxyXG4gICAgICAgICAgICBjb25zdWx0YXM6IHJlc3VsdGFkb1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHRhZG8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBmZWVkYmFjay5zdWNlc3NvID0gdHJ1ZTtcclxuICAgICAgICAgICAgZmVlZGJhY2subWVuc2FnZW0gPSBcIlJlZ2lzdHJvIHJlY3VwZXJhZG8gY29tIHN1Y2Vzc28hXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZmVlZGJhY2suc3VjZXNzbyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmZWVkYmFjay5tZW5zYWdlbSA9IGBOZW5odW0gcmVnaXN0cm8gZGUgY29uc3VsdGFzIHBhcmEgbyBwYWNpZW50ZSBjb20gaWQ6JHtwYWNpZW50ZS5pZH0gZm9pIGVuY29udHJhZG8gbm8gYmFuY28gZGUgZGFkb3MuYDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmZWVkYmFjay5zdWNlc3NvKSB7XHJcbiAgICAgICAgICAgIC8vcmV0b3JuYW5kbyBvIHJlc3VsdGFkb1xyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbihmZWVkYmFjayk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg0MDQpLmpzb24oZmVlZGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2hcclxuICAgICAgICAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgc3VjZXNzbzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtZW5zYWdlbTogJ07Do28gY29uc2VndWltb3MgcmVjdXBlcmFyIG9zIHJlZ2lzdHJvcycsXHJcbiAgICAgICAgICAgICAgICBlcnJvOiBlLm1lc3NhZ2VcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgICByZXMuZW5kKCk7XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJAcHJpc21hL2NsaWVudFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7Il0sIm5hbWVzIjpbInZlcmlmeSIsImF1dGVudGljYWRvIiwiZm4iLCJyZXEiLCJyZXMiLCJoZWFkZXJzIiwiYXV0aG9yaXphdGlvbiIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwiZXJyIiwiZGVjb2RlZCIsInN0YXR1cyIsImpzb24iLCJzdWNlc3NvIiwibWVuc2FnZW0iLCJlcnJvIiwiSlNPTiIsInN0cmluZ2lmeSIsIlByaXNtYUNsaWVudCIsInByaXNtYSIsImdsb2JhbCIsImxvZyIsIkNvbnN1bHRhcyIsIm1ldG9kbyIsIm1ldGhvZCIsIm9idGVyVG9kYXMiLCJzZXRIZWFkZXIiLCJlbmQiLCJ0b2tlbiIsInVzdWFyaW9JZCIsInN1YiIsInBhY2llbnRlIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiY29uc29sZSIsInJlc3VsdGFkbyIsImNvbnN1bHRhIiwiZmluZE1hbnkiLCJwYWNpZW50ZUlkIiwiaWQiLCJpbmNsdWRlIiwiZW1wcmVzYSIsImVuZGVyZWNvIiwiYmFpcnJvIiwiY2lkYWRlIiwidWZzIiwibWVkaWNvIiwiZXNwZWNpYWxpZGFkZSIsImNvbnZlbmlvIiwicmVjZWl0YSIsIm1lZGljYW1lbnRvcyIsImZlZWRiYWNrIiwiY29uc3VsdGFzIiwiZSIsIkVycm9yIiwibWVzc2FnZSJdLCJzb3VyY2VSb290IjoiIn0=