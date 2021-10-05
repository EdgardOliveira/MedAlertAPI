"use strict";
(() => {
var exports = {};
exports.id = 174;
exports.ids = [174];
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

/***/ 112:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_autenticado__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(769);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(841);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_autenticado__WEBPACK_IMPORTED_MODULE_0__/* .autenticado */ .b)(async function (req, res) {
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

async function consultarRemedio(req, res) {
  const {
    codigo
  } = req.query;

  try {
    //verificando se foi fornecido um código GTIN/EAN
    if (!codigo) return res.status(400).json({
      sucesso: false,
      mensagem: 'Um código de barras deve ser fornecido'
    }); //Consultando se o código GTIN/EAN já está registrado no banco de dados

    const consulta = await consultarRemedioBD(String(codigo));

    if (!consulta) {
      //Não foi encontrado no banco de dados... faz a consulta na CosmosAPI
      const cosmosJSON = await consultarCosmosAPI(String(codigo));
      let remed;

      if (cosmosJSON != null) {
        //prepara o remédio para cadastro
        remed = {
          gtin: String(cosmosJSON.gtin),
          nome: cosmosJSON.description,
          laboratorio: cosmosJSON.brand.name,
          imagemCaixa: cosmosJSON.thumbnail,
          imagemCodigoBarras: cosmosJSON.barcode_image,
          precoMin: cosmosJSON.min_price,
          precoMed: cosmosJSON.avg_price,
          precoMax: cosmosJSON.max_price
        }; //Ja tem o remédio... consulta os dados da bula

        const dadosBula = await consultarBulaAPI(remed);

        if (dadosBula != null) {
          //tem dados da bula... mesclar com o remédio e cadastrar
          remed = _objectSpread(_objectSpread({}, remed), {}, {
            idProduto: dadosBula.idProduto,
            registro: dadosBula.registro,
            bula: dadosBula.bula
          });
          const resultado = await cadastrarRemedioBD(remed);
          return res.status(201).json({
            sucesso: true,
            mensagem: 'Dados cadastrados com sucesso!',
            remedio: resultado
          });
        } else {
          //cadastra somente os dados do remédio
          const resultado = await cadastrarRemedioBD(remed);
          return res.status(201).json({
            sucesso: true,
            mensagem: 'Dados cadastrados com sucesso!',
            remedio: resultado
          });
        }
      } else {
        //A API cosmos não retornou dados
        return res.status(204).json({
          sucesso: true,
          mensagem: 'Não conseguimos obter dados sobre o remédio!',
          remedio: null
        });
      }
    } else {
      //Foi encontrado no banco de dados
      return res.status(200).json({
        sucesso: true,
        mensagem: 'Dados consultados com sucesso!',
        remedio: consulta
      });
    }
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({
        sucesso: false,
        mensagem: 'Ocorreu um erro durante a consulta do remédio',
        erro: e.message,
        enviado: req.query
      });
    }
  }
}

async function consultarRemedioBD(codigo) {
  console.log(`Foi solicitado a consulta de um remédio no banco de dados pelo GTIN/EAN: ${codigo}`);
  const resultado = await _lib_db__WEBPACK_IMPORTED_MODULE_1__/* .prisma.remedio.findUnique */ ._.remedio.findUnique({
    where: {
      gtin: String(codigo)
    }
  });
  if (resultado != null) console.log('Os dados para este código foram encontrados no banco de dados...');else console.log('Os dados para este código não foram encontrados no banco de dados...');
  return resultado;
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

async function cadastrarRemedioBD(remedio) {
  console.log(`Foi solicitado o cadastro de um remédio no banco de dados \n${JSON.stringify(remedio, null, 4)}`);
  const remedioCadastrado = await _lib_db__WEBPACK_IMPORTED_MODULE_1__/* .prisma.remedio.create */ ._.remedio.create({
    data: remedio
  });
  if (remedioCadastrado != null) console.log('Remédio cadastro com sucesso no banco de dados...');else console.log('O remédio não foi cadastro no banco de dados');
  return remedioCadastrado;
}

async function consultarBulaAPI(remedio) {
  console.log(`Foi solicitado a bula do remédio ${remedio.nome}`); //pega o primeiro nome antes do espaçamento

  const primeiroNome = remedio.nome.split(" ")[0];
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
  let dadosBula = {
    idProduto: 0,
    registro: "",
    bula: ""
  };

  if (bula != null) {
    console.log(`A API Bula retornou os dados... \n${JSON.stringify(bula, null, 4)}`); //Considerando o primeiro resultado

    if (bula.content[0] != null) {
      //tem dados da bula... atualiza os campos referente a bula no JSON
      dadosBula = {
        idProduto: bula.content[0].idProduto,
        registro: bula.content[0].numeroRegistro,
        bula: bula.content[0].idBulaPacienteProtegido
      };
      console.log(`Dados da bula foram incluídos no registro do remédio... \n${JSON.stringify(dadosBula, null, 4)}`);
      return dadosBula;
    }
  } else {
    console.log('Não conseguimos a bula deste remedio...');
    return dadosBula;
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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(112));
module.exports = __webpack_exports__;

})();