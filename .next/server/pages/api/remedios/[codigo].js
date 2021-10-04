"use strict";
(() => {
var exports = {};
exports.id = "pages/api/remedios/[codigo]";
exports.ids = ["pages/api/remedios/[codigo]"];
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

/***/ "./pages/api/remedios/[codigo].ts":
/*!****************************************!*\
  !*** ./pages/api/remedios/[codigo].ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_autenticado__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/autenticado */ "./lib/autenticado.ts");
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/db */ "./lib/db.ts");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_autenticado__WEBPACK_IMPORTED_MODULE_0__.autenticado)(async function Remedios(req, res) {
  const metodo = req.method;

  switch (metodo) {
    case "GET":
      consultarRemedio(req, res);
      break;

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
  }
}));

async function consultarRemedioBD(codigo) {
  console.log(`Foi solicitado a consulta de um remedio no banco de dados pelo GTIN/EAN: ${codigo}`);
  const resultado = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.remedio.findUnique({
    where: {
      gtin: String(codigo)
    }
  });
  if (resultado != null) console.log('Os dados para este código foram encontrados no banco de dados...');else console.log('Os dados para este código não foram encontrados no banco de dados...');
  return resultado;
}

async function cadastrarRemedioBD(remedio) {
  console.log(`Foi solicitado o cadastro de um remédio no banco de dados \n${JSON.stringify(remedio, null, 4)}`);
  const remedioCadastrado = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.remedio.create({
    data: remedio
  });
  if (remedioCadastrado != null) console.log('Remédio cadastro com sucesso no banco de dados...');else console.log('O remédio não foi cadastro no banco de dados');
  return remedioCadastrado;
}

async function atualizarRemedioBD(remedio) {
  console.log(`Foi solicitado a atualização de dados do remédio no banco de dados... GTIN: ${remedio.gtin}`); // try{
  //     const remedioAtualizado = await prisma.remedio.update({
  //         where: {
  //             gtin: String(remedio.gtin)
  //         },
  //         data: JSON.stringify(remedio)
  //     });
  //
  //     if (remedioAtualizado != null)
  //         console.log('Os dados do remédio foram atualizados no banco de dados...');
  //     else
  //         console.log('O remédio não foi atualizado no banco de dados');
  //     return remedioAtualizado;
  // } finally {
  //
  // }

  return remedio;
}

async function consultarCosmosAPI(codigo) {
  console.log(`Estamos solicitando dados do GTIN/EAN: ${codigo} para a API COSMOS...`);
  const resultado = await fetch(`${process.env.COSMOS_BASE_URL}/gtins/${codigo}`, {
    method: 'GET',
    headers: {
      'Aceppt': '*/*',
      'Content-Type': 'application/json;charset=utf-8',
      'User-Agent': 'Cosmos-API-Request',
      'X-Cosmos-Token': `${process.env.COSMOS_TOKEN}`
    },
    mode: 'cors',
    cache: 'default'
  });
  const json = await resultado.json();
  console.log(`A API COSMOS devolveu a resposta... \n${JSON.stringify(json, null, 4)}`);
  return json;
}

async function consultarBulaAPI(remedio) {
  console.log(`Foi solicitado a bula do remédio ${remedio.nome}`);
  const nome = String(remedio.nome); //pega o primeiro nome antes do espaçamento

  const primeiroNome = nome.split(" ")[0];
  console.log(`Solicitando dados da bula do remédio por ${primeiroNome}`);
  const resultado = await fetch(`${process.env.BULA_BASE_URL}/pesquisar?nome=${primeiroNome}&pagina=1`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    mode: 'cors',
    cache: 'default'
  });
  const bula = await resultado.json();

  if (bula != null) {
    console.log(`A API Bula retornou os dados... \n${JSON.stringify(bula, null, 4)}`); //Considerando o primeiro resultado

    if (bula.content[0] != null) {
      //tem dados da bula... atualiza os campos referente a bula no JSON
      //Concatenando conteúdos
      let remedioBula = _objectSpread(_objectSpread({}, remedio), {}, {
        idProduto: bula.content[0].idProduto,
        registro: bula.content[0].numeroRegistro,
        bula: bula.content[0].idBulaPacienteProtegido
      });

      console.log('Atualizando dados da bula do remedio no banco de dados...');
      const remedioAtualizado = await atualizarRemedioBD(remedioBula);
      if (remedioAtualizado != null) console.log(`Dados da bula foram incluídos no registro do remédio... \n${JSON.stringify(remedioAtualizado, null, 4)}`);
      return remedioAtualizado;
    }
  } else {
    console.log('Não conseguimos a bula deste remedio...');
    return remedio;
  }
}

async function consultarRemedio(req, res) {
  const {
    codigo
  } = req.query;

  try {
    //verificando se foi fornecido um código GTIN/EAN
    if (!codigo) return res.status(400).json({
      sucesso: false,
      mensagem: 'Um código deve ser fornecido'
    }); //Consultando se o código GTIN/EAN já está registrado no banco de dados

    const consulta = await consultarRemedioBD(String(codigo));

    if (consulta != null) {
      //verifica se ja tem os dados da bula
      if (consulta.bula == null) {
        //dispara a consulta da bula do medicamento
        const remedio = await consultarBulaAPI(consulta);
        return res.status(200).json({
          sucesso: true,
          mensagem: 'Dados consultados com sucesso!',
          remedio: remedio
        });
      } else {
        return res.status(200).json({
          sucesso: true,
          mensagem: 'Dados consultados com sucesso!',
          remedio: consulta
        });
      }
    } else {
      //Não foi encontrado... faz a consulta na CosmosAPI
      const cosmosJSON = await consultarCosmosAPI(String(codigo));

      if (cosmosJSON != null) {
        const remed = {
          gtin: String(cosmosJSON.gtin),
          nome: cosmosJSON.description,
          laboratorio: cosmosJSON.brand.name,
          imagemCaixa: cosmosJSON.thumbnail,
          imagemCodigoBarras: cosmosJSON.barcode_image,
          precoMin: cosmosJSON.min_price,
          precoMed: cosmosJSON.avg_price,
          precoMax: cosmosJSON.max_price
        }; // @ts-ignore

        const remedioCadastrado = await cadastrarRemedioBD(remed);

        if (remedioCadastrado.bula == null) {
          //dispara a consulta da bula do remedio
          const remedio = await consultarBulaAPI(remedioCadastrado);
          return res.status(201).json({
            sucesso: true,
            mensagem: 'Dados cadastrados com sucesso!',
            remedio: remedio
          });
        } else {
          return res.status(201).json({
            sucesso: true,
            mensagem: 'Dados cadastrados com sucesso!',
            remedio: remedioCadastrado
          });
        }
      } else {
        return res.status(404).json({
          sucesso: false,
          mensagem: 'Dados não encontrados na COSMOS API!'
        });
      }
    }
  } catch (e) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Ocorreu um erro durante a consulta do remédio',
      erro: e.message,
      enviado: req.query
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
var __webpack_exports__ = (__webpack_exec__("./pages/api/remedios/[codigo].ts"));
module.exports = __webpack_exports__;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUZjO0FBR3hCQyxNQUFBQSxJQUFJLEVBQUVnRSxDQUFDLENBQUNDLE9BSGdCO0FBSXhCQyxNQUFBQSxPQUFPLEVBQUUvRSxHQUFHLENBQUMyRDtBQUpXLEtBQXJCLENBQVA7QUFNSDtBQUNKOzs7Ozs7Ozs7O0FDdE5EOzs7Ozs7Ozs7O0FDQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZWRhbGVydGFwaS8uL2xpYi9hdXRlbnRpY2Fkby50cyIsIndlYnBhY2s6Ly9tZWRhbGVydGFwaS8uL2xpYi9kYi50cyIsIndlYnBhY2s6Ly9tZWRhbGVydGFwaS8uL3BhZ2VzL2FwaS9yZW1lZGlvcy9bY29kaWdvXS50cyIsIndlYnBhY2s6Ly9tZWRhbGVydGFwaS9leHRlcm5hbCBcIkBwcmlzbWEvY2xpZW50XCIiLCJ3ZWJwYWNrOi8vbWVkYWxlcnRhcGkvZXh0ZXJuYWwgXCJqc29ud2VidG9rZW5cIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3ZlcmlmeX0gZnJvbSAnanNvbndlYnRva2VuJztcclxuaW1wb3J0IHtOZXh0QXBpSGFuZGxlciwgTmV4dEFwaVJlcXVlc3QsIE5leHRBcGlSZXNwb25zZX0gZnJvbSAnbmV4dCc7XHJcblxyXG5leHBvcnQgY29uc3QgYXV0ZW50aWNhZG8gPSAoZm46IE5leHRBcGlIYW5kbGVyKSA9PiBhc3luYyAocmVxOiBOZXh0QXBpUmVxdWVzdCwgcmVzOiBOZXh0QXBpUmVzcG9uc2UsKSA9PiB7XHJcbiAgICBpZiAocmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiEpIHtcclxuICAgICAgICAvL2VzdGEgcGVsbyBhcHBcclxuICAgICAgICB2ZXJpZnkocmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbiEsIHByb2Nlc3MuZW52LkpXVF9TRUNSRVQsIChhc3luYyBmdW5jdGlvbiAoZXJyLCBkZWNvZGVkKSB7XHJcbiAgICAgICAgICAgIGlmICghZXJyICYmIGRlY29kZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZm4ocmVxLCByZXMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Vzc286IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbWVuc2FnZW06ICdPIHRva2VuIGluZm9ybWFkbyDDqSBpbnbDoWxpZG8nLFxyXG4gICAgICAgICAgICAgICAgZXJybzogSlNPTi5zdHJpbmdpZnkoZXJyKSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHtcclxuICAgICAgICAgICAgc3VjZXNzbzogZmFsc2UsXHJcbiAgICAgICAgICAgIG1lbnNhZ2VtOiAnTsOjbyBmb2kgZW52aWFkbyB1bSB0b2tlbidcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICAgIHZhciBwcmlzbWE6IFByaXNtYUNsaWVudCB8IHVuZGVmaW5lZFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcHJpc21hID1cclxuICAgIGdsb2JhbC5wcmlzbWEgfHxcclxuICAgIG5ldyBQcmlzbWFDbGllbnQoe1xyXG4gICAgICAgIGxvZzogWydxdWVyeSddLFxyXG4gICAgfSlcclxuXHJcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWwucHJpc21hID0gcHJpc21hIiwiaW1wb3J0IHsgUmVtZWRpbyB9IGZyb20gXCJAcHJpc21hL2NsaWVudFwiO1xyXG5pbXBvcnQge05leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2V9IGZyb20gXCJuZXh0XCI7XHJcbmltcG9ydCB7IGF1dGVudGljYWRvIH0gZnJvbSBcIi4uLy4uLy4uL2xpYi9hdXRlbnRpY2Fkb1wiO1xyXG5pbXBvcnQgeyBwcmlzbWF9IGZyb20gXCIuLi8uLi8uLi9saWIvZGJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGF1dGVudGljYWRvKGFzeW5jIGZ1bmN0aW9uIFJlbWVkaW9zKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XHJcbiAgICBjb25zdCBtZXRvZG8gPSByZXEubWV0aG9kO1xyXG5cclxuICAgIHN3aXRjaCAobWV0b2RvKSB7XHJcbiAgICAgICAgY2FzZSBcIkdFVFwiOlxyXG4gICAgICAgICAgICBjb25zdWx0YXJSZW1lZGlvKHJlcSwgcmVzKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignQWxsb3cnLCBbJ0dFVCddKVxyXG4gICAgICAgICAgICByZXMuc3RhdHVzKDQwNSkuZW5kKGBNw6l0b2RvOiAke21ldG9kb30gbsOjbyDDqSBwZXJtaXRpZG8gcGFyYSBlc3RhIHJvdGFgKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBjb25zdWx0YXJSZW1lZGlvQkQoY29kaWdvOiBTdHJpbmcpIHtcclxuICAgIGNvbnNvbGUubG9nKGBGb2kgc29saWNpdGFkbyBhIGNvbnN1bHRhIGRlIHVtIHJlbWVkaW8gbm8gYmFuY28gZGUgZGFkb3MgcGVsbyBHVElOL0VBTjogJHtjb2RpZ299YCk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0YWRvID0gYXdhaXQgcHJpc21hLnJlbWVkaW8uZmluZFVuaXF1ZSh7XHJcbiAgICAgICAgd2hlcmU6IHtcclxuICAgICAgICAgICAgZ3RpbjogU3RyaW5nKGNvZGlnbylcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAocmVzdWx0YWRvICE9IG51bGwpXHJcbiAgICAgICAgY29uc29sZS5sb2coJ09zIGRhZG9zIHBhcmEgZXN0ZSBjw7NkaWdvIGZvcmFtIGVuY29udHJhZG9zIG5vIGJhbmNvIGRlIGRhZG9zLi4uJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgY29uc29sZS5sb2coJ09zIGRhZG9zIHBhcmEgZXN0ZSBjw7NkaWdvIG7Do28gZm9yYW0gZW5jb250cmFkb3Mgbm8gYmFuY28gZGUgZGFkb3MuLi4nKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0YWRvO1xyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBjYWRhc3RyYXJSZW1lZGlvQkQocmVtZWRpbzogUmVtZWRpbykge1xyXG4gICAgY29uc29sZS5sb2coYEZvaSBzb2xpY2l0YWRvIG8gY2FkYXN0cm8gZGUgdW0gcmVtw6lkaW8gbm8gYmFuY28gZGUgZGFkb3MgXFxuJHtKU09OLnN0cmluZ2lmeShyZW1lZGlvLCBudWxsLCA0KX1gKTtcclxuICAgIGNvbnN0IHJlbWVkaW9DYWRhc3RyYWRvID0gYXdhaXQgcHJpc21hLnJlbWVkaW8uY3JlYXRlKHtcclxuICAgICAgICBkYXRhOiByZW1lZGlvXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIHJlbWVkaW9DYWRhc3RyYWRvICE9IG51bGwpXHJcbiAgICAgICAgY29uc29sZS5sb2coJ1JlbcOpZGlvIGNhZGFzdHJvIGNvbSBzdWNlc3NvIG5vIGJhbmNvIGRlIGRhZG9zLi4uJyk7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgY29uc29sZS5sb2coJ08gcmVtw6lkaW8gbsOjbyBmb2kgY2FkYXN0cm8gbm8gYmFuY28gZGUgZGFkb3MnKTtcclxuXHJcbiAgICByZXR1cm4gcmVtZWRpb0NhZGFzdHJhZG87XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGF0dWFsaXphclJlbWVkaW9CRChyZW1lZGlvOiBSZW1lZGlvKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgRm9pIHNvbGljaXRhZG8gYSBhdHVhbGl6YcOnw6NvIGRlIGRhZG9zIGRvIHJlbcOpZGlvIG5vIGJhbmNvIGRlIGRhZG9zLi4uIEdUSU46ICR7cmVtZWRpby5ndGlufWApO1xyXG5cclxuICAgIC8vIHRyeXtcclxuICAgIC8vICAgICBjb25zdCByZW1lZGlvQXR1YWxpemFkbyA9IGF3YWl0IHByaXNtYS5yZW1lZGlvLnVwZGF0ZSh7XHJcbiAgICAvLyAgICAgICAgIHdoZXJlOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBndGluOiBTdHJpbmcocmVtZWRpby5ndGluKVxyXG4gICAgLy8gICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShyZW1lZGlvKVxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy9cclxuICAgIC8vICAgICBpZiAocmVtZWRpb0F0dWFsaXphZG8gIT0gbnVsbClcclxuICAgIC8vICAgICAgICAgY29uc29sZS5sb2coJ09zIGRhZG9zIGRvIHJlbcOpZGlvIGZvcmFtIGF0dWFsaXphZG9zIG5vIGJhbmNvIGRlIGRhZG9zLi4uJyk7XHJcbiAgICAvLyAgICAgZWxzZVxyXG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZygnTyByZW3DqWRpbyBuw6NvIGZvaSBhdHVhbGl6YWRvIG5vIGJhbmNvIGRlIGRhZG9zJyk7XHJcbiAgICAvLyAgICAgcmV0dXJuIHJlbWVkaW9BdHVhbGl6YWRvO1xyXG4gICAgLy8gfSBmaW5hbGx5IHtcclxuICAgIC8vXHJcbiAgICAvLyB9XHJcbiAgICByZXR1cm4gcmVtZWRpbztcclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29uc3VsdGFyQ29zbW9zQVBJKGNvZGlnbzogU3RyaW5nKSB7XHJcbiAgICBjb25zb2xlLmxvZyhgRXN0YW1vcyBzb2xpY2l0YW5kbyBkYWRvcyBkbyBHVElOL0VBTjogJHtjb2RpZ299IHBhcmEgYSBBUEkgQ09TTU9TLi4uYCk7XHJcblxyXG4gICAgY29uc3QgcmVzdWx0YWRvID0gYXdhaXQgZmV0Y2goYCR7cHJvY2Vzcy5lbnYuQ09TTU9TX0JBU0VfVVJMfS9ndGlucy8ke2NvZGlnb31gLCB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdBY2VwcHQnOiAnKi8qJyxcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnLFxyXG4gICAgICAgICAgICAnVXNlci1BZ2VudCc6ICdDb3Ntb3MtQVBJLVJlcXVlc3QnLFxyXG4gICAgICAgICAgICAnWC1Db3Ntb3MtVG9rZW4nOiBgJHtwcm9jZXNzLmVudi5DT1NNT1NfVE9LRU59YFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnZGVmYXVsdCdcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXN1bHRhZG8uanNvbigpO1xyXG4gICAgY29uc29sZS5sb2coYEEgQVBJIENPU01PUyBkZXZvbHZldSBhIHJlc3Bvc3RhLi4uIFxcbiR7SlNPTi5zdHJpbmdpZnkoanNvbiwgbnVsbCwgNCl9YCk7XHJcblxyXG4gICAgcmV0dXJuIGpzb247XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNvbnN1bHRhckJ1bGFBUEkocmVtZWRpbzogUmVtZWRpbykge1xyXG4gICAgY29uc29sZS5sb2coYEZvaSBzb2xpY2l0YWRvIGEgYnVsYSBkbyByZW3DqWRpbyAke3JlbWVkaW8ubm9tZX1gKTtcclxuXHJcbiAgICBjb25zdCBub21lID0gU3RyaW5nKHJlbWVkaW8ubm9tZSk7XHJcbiAgICAvL3BlZ2EgbyBwcmltZWlybyBub21lIGFudGVzIGRvIGVzcGHDp2FtZW50b1xyXG4gICAgY29uc3QgcHJpbWVpcm9Ob21lID0gbm9tZS5zcGxpdChcIiBcIilbMF07XHJcblxyXG4gICAgY29uc29sZS5sb2coYFNvbGljaXRhbmRvIGRhZG9zIGRhIGJ1bGEgZG8gcmVtw6lkaW8gcG9yICR7cHJpbWVpcm9Ob21lfWApO1xyXG5cclxuICAgIGNvbnN0IHJlc3VsdGFkbyA9IGF3YWl0IGZldGNoKGAke3Byb2Nlc3MuZW52LkJVTEFfQkFTRV9VUkx9L3Blc3F1aXNhcj9ub21lPSR7cHJpbWVpcm9Ob21lfSZwYWdpbmE9MWAsIHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW9kZTogJ2NvcnMnLFxyXG4gICAgICAgIGNhY2hlOiAnZGVmYXVsdCdcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGJ1bGEgPSBhd2FpdCByZXN1bHRhZG8uanNvbigpO1xyXG4gICAgaWYgKGJ1bGEgIT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBBIEFQSSBCdWxhIHJldG9ybm91IG9zIGRhZG9zLi4uIFxcbiR7SlNPTi5zdHJpbmdpZnkoYnVsYSwgbnVsbCwgNCl9YCk7XHJcblxyXG4gICAgICAgIC8vQ29uc2lkZXJhbmRvIG8gcHJpbWVpcm8gcmVzdWx0YWRvXHJcbiAgICAgICAgaWYgKGJ1bGEuY29udGVudFswXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vdGVtIGRhZG9zIGRhIGJ1bGEuLi4gYXR1YWxpemEgb3MgY2FtcG9zIHJlZmVyZW50ZSBhIGJ1bGEgbm8gSlNPTlxyXG4gICAgICAgICAgICAvL0NvbmNhdGVuYW5kbyBjb250ZcO6ZG9zXHJcbiAgICAgICAgICAgIGxldCByZW1lZGlvQnVsYSA9IHtcclxuICAgICAgICAgICAgICAgIC4uLnJlbWVkaW8sXHJcbiAgICAgICAgICAgICAgICBpZFByb2R1dG86IGJ1bGEuY29udGVudFswXS5pZFByb2R1dG8sXHJcbiAgICAgICAgICAgICAgICByZWdpc3RybzogYnVsYS5jb250ZW50WzBdLm51bWVyb1JlZ2lzdHJvLFxyXG4gICAgICAgICAgICAgICAgYnVsYTogYnVsYS5jb250ZW50WzBdLmlkQnVsYVBhY2llbnRlUHJvdGVnaWRvLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQXR1YWxpemFuZG8gZGFkb3MgZGEgYnVsYSBkbyByZW1lZGlvIG5vIGJhbmNvIGRlIGRhZG9zLi4uJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbWVkaW9BdHVhbGl6YWRvID0gYXdhaXQgYXR1YWxpemFyUmVtZWRpb0JEKHJlbWVkaW9CdWxhKTtcclxuICAgICAgICAgICAgaWYgKHJlbWVkaW9BdHVhbGl6YWRvICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRGFkb3MgZGEgYnVsYSBmb3JhbSBpbmNsdcOtZG9zIG5vIHJlZ2lzdHJvIGRvIHJlbcOpZGlvLi4uIFxcbiR7SlNPTi5zdHJpbmdpZnkocmVtZWRpb0F0dWFsaXphZG8sIG51bGwsIDQpfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVtZWRpb0F0dWFsaXphZG87XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnTsOjbyBjb25zZWd1aW1vcyBhIGJ1bGEgZGVzdGUgcmVtZWRpby4uLicpO1xyXG4gICAgICAgIHJldHVybiByZW1lZGlvO1xyXG4gICAgfVxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBjb25zdWx0YXJSZW1lZGlvKHJlcTogTmV4dEFwaVJlcXVlc3QsIHJlczogTmV4dEFwaVJlc3BvbnNlKSB7XHJcbiAgICBjb25zdCB7IGNvZGlnbyB9ID0gcmVxLnF1ZXJ5O1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgLy92ZXJpZmljYW5kbyBzZSBmb2kgZm9ybmVjaWRvIHVtIGPDs2RpZ28gR1RJTi9FQU5cclxuICAgICAgICBpZiAoIWNvZGlnbylcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Vzc286IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbWVuc2FnZW06ICdVbSBjw7NkaWdvIGRldmUgc2VyIGZvcm5lY2lkbydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vQ29uc3VsdGFuZG8gc2UgbyBjw7NkaWdvIEdUSU4vRUFOIGrDoSBlc3TDoSByZWdpc3RyYWRvIG5vIGJhbmNvIGRlIGRhZG9zXHJcbiAgICAgICAgY29uc3QgY29uc3VsdGEgPSBhd2FpdCBjb25zdWx0YXJSZW1lZGlvQkQoU3RyaW5nKGNvZGlnbykpO1xyXG5cclxuICAgICAgICBpZiAoY29uc3VsdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvL3ZlcmlmaWNhIHNlIGphIHRlbSBvcyBkYWRvcyBkYSBidWxhXHJcbiAgICAgICAgICAgIGlmIChjb25zdWx0YS5idWxhID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIC8vZGlzcGFyYSBhIGNvbnN1bHRhIGRhIGJ1bGEgZG8gbWVkaWNhbWVudG9cclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbWVkaW8gPSBhd2FpdCBjb25zdWx0YXJCdWxhQVBJKGNvbnN1bHRhKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcclxuICAgICAgICAgICAgICAgICAgICBzdWNlc3NvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lbnNhZ2VtOiAnRGFkb3MgY29uc3VsdGFkb3MgY29tIHN1Y2Vzc28hJyxcclxuICAgICAgICAgICAgICAgICAgICByZW1lZGlvOiByZW1lZGlvXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMCkuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VjZXNzbzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBtZW5zYWdlbTogJ0RhZG9zIGNvbnN1bHRhZG9zIGNvbSBzdWNlc3NvIScsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVtZWRpbzogY29uc3VsdGFcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy9Ow6NvIGZvaSBlbmNvbnRyYWRvLi4uIGZheiBhIGNvbnN1bHRhIG5hIENvc21vc0FQSVxyXG4gICAgICAgICAgICBjb25zdCBjb3Ntb3NKU09OID0gYXdhaXQgY29uc3VsdGFyQ29zbW9zQVBJKFN0cmluZyhjb2RpZ28pKTtcclxuICAgICAgICAgICAgaWYgKGNvc21vc0pTT04gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtZWQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3RpbjogU3RyaW5nKGNvc21vc0pTT04uZ3RpbiksXHJcbiAgICAgICAgICAgICAgICAgICAgbm9tZTogY29zbW9zSlNPTi5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBsYWJvcmF0b3JpbzogY29zbW9zSlNPTi5icmFuZC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlbUNhaXhhOiBjb3Ntb3NKU09OLnRodW1ibmFpbCxcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZW1Db2RpZ29CYXJyYXM6IGNvc21vc0pTT04uYmFyY29kZV9pbWFnZSxcclxuICAgICAgICAgICAgICAgICAgICBwcmVjb01pbjogY29zbW9zSlNPTi5taW5fcHJpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlY29NZWQ6IGNvc21vc0pTT04uYXZnX3ByaWNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHByZWNvTWF4OiBjb3Ntb3NKU09OLm1heF9wcmljZSxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtZWRpb0NhZGFzdHJhZG8gPSBhd2FpdCBjYWRhc3RyYXJSZW1lZGlvQkQocmVtZWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlbWVkaW9DYWRhc3RyYWRvLmJ1bGEgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZGlzcGFyYSBhIGNvbnN1bHRhIGRhIGJ1bGEgZG8gcmVtZWRpb1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbWVkaW8gPSBhd2FpdCBjb25zdWx0YXJCdWxhQVBJKHJlbWVkaW9DYWRhc3RyYWRvKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDIwMSkuanNvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Vzc286IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lbnNhZ2VtOiAnRGFkb3MgY2FkYXN0cmFkb3MgY29tIHN1Y2Vzc28hJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtZWRpbzogcmVtZWRpb1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cygyMDEpLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNlc3NvOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZW5zYWdlbTogJ0RhZG9zIGNhZGFzdHJhZG9zIGNvbSBzdWNlc3NvIScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbWVkaW86IHJlbWVkaW9DYWRhc3RyYWRvXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oe1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Vzc286IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lbnNhZ2VtOiAnRGFkb3MgbsOjbyBlbmNvbnRyYWRvcyBuYSBDT1NNT1MgQVBJIScsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGU6IGFueSkge1xyXG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7XHJcbiAgICAgICAgICAgIHN1Y2Vzc286IGZhbHNlLFxyXG4gICAgICAgICAgICBtZW5zYWdlbTogJ09jb3JyZXUgdW0gZXJybyBkdXJhbnRlIGEgY29uc3VsdGEgZG8gcmVtw6lkaW8nLFxyXG4gICAgICAgICAgICBlcnJvOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgIGVudmlhZG86IHJlcS5xdWVyeVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiQHByaXNtYS9jbGllbnRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwianNvbndlYnRva2VuXCIpOyJdLCJuYW1lcyI6WyJ2ZXJpZnkiLCJhdXRlbnRpY2FkbyIsImZuIiwicmVxIiwicmVzIiwiaGVhZGVycyIsImF1dGhvcml6YXRpb24iLCJwcm9jZXNzIiwiZW52IiwiSldUX1NFQ1JFVCIsImVyciIsImRlY29kZWQiLCJzdGF0dXMiLCJqc29uIiwic3VjZXNzbyIsIm1lbnNhZ2VtIiwiZXJybyIsIkpTT04iLCJzdHJpbmdpZnkiLCJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJnbG9iYWwiLCJsb2ciLCJSZW1lZGlvcyIsIm1ldG9kbyIsIm1ldGhvZCIsImNvbnN1bHRhclJlbWVkaW8iLCJzZXRIZWFkZXIiLCJlbmQiLCJjb25zdWx0YXJSZW1lZGlvQkQiLCJjb2RpZ28iLCJjb25zb2xlIiwicmVzdWx0YWRvIiwicmVtZWRpbyIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImd0aW4iLCJTdHJpbmciLCJjYWRhc3RyYXJSZW1lZGlvQkQiLCJyZW1lZGlvQ2FkYXN0cmFkbyIsImNyZWF0ZSIsImRhdGEiLCJhdHVhbGl6YXJSZW1lZGlvQkQiLCJjb25zdWx0YXJDb3Ntb3NBUEkiLCJmZXRjaCIsIkNPU01PU19CQVNFX1VSTCIsIkNPU01PU19UT0tFTiIsIm1vZGUiLCJjYWNoZSIsImNvbnN1bHRhckJ1bGFBUEkiLCJub21lIiwicHJpbWVpcm9Ob21lIiwic3BsaXQiLCJCVUxBX0JBU0VfVVJMIiwiYnVsYSIsImNvbnRlbnQiLCJyZW1lZGlvQnVsYSIsImlkUHJvZHV0byIsInJlZ2lzdHJvIiwibnVtZXJvUmVnaXN0cm8iLCJpZEJ1bGFQYWNpZW50ZVByb3RlZ2lkbyIsInJlbWVkaW9BdHVhbGl6YWRvIiwicXVlcnkiLCJjb25zdWx0YSIsImNvc21vc0pTT04iLCJyZW1lZCIsImRlc2NyaXB0aW9uIiwibGFib3JhdG9yaW8iLCJicmFuZCIsIm5hbWUiLCJpbWFnZW1DYWl4YSIsInRodW1ibmFpbCIsImltYWdlbUNvZGlnb0JhcnJhcyIsImJhcmNvZGVfaW1hZ2UiLCJwcmVjb01pbiIsIm1pbl9wcmljZSIsInByZWNvTWVkIiwiYXZnX3ByaWNlIiwicHJlY29NYXgiLCJtYXhfcHJpY2UiLCJlIiwibWVzc2FnZSIsImVudmlhZG8iXSwic291cmNlUm9vdCI6IiJ9