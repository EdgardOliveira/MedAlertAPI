"use strict";
(() => {
var exports = {};
exports.id = 675;
exports.ids = [675];
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

/***/ 771:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(773);
/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_autenticado__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(769);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(841);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_autenticado__WEBPACK_IMPORTED_MODULE_1__/* .autenticado */ .b)(async function (req, res) {
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
  const empresa = req.body.empresa;
  const paciente = req.body.paciente;
  const medico = req.body.medico;
  const medicamentos = req.body.receita.medicamentos;

  try {
    //verificando se os campos foram fornecidos
    if (!empresa || !paciente || !medico || !medicamentos) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'É necessário fornecer todos os dados'
      });
    }

    const resultado = await _lib_db__WEBPACK_IMPORTED_MODULE_2__/* .prisma.consulta.create */ ._.consulta.create({
      data: {
        empresa: {
          connectOrCreate: {
            where: {
              cnpj: empresa.cnpj
            },
            create: {
              cnpj: empresa.cnpj,
              nome: empresa.nome,
              nomeFantasia: empresa.nomeFantasia,
              telefone: empresa.telefone,
              endereco: {
                create: {
                  cep: empresa.endereco.cep,
                  logradouro: empresa.endereco.logradouro,
                  numero: empresa.endereco.numero,
                  complemento: empresa.endereco.complemento,
                  bairro: {
                    connectOrCreate: {
                      where: {
                        nome: empresa.endereco.bairro
                      },
                      create: {
                        nome: empresa.endereco.bairro,
                        cidade: {
                          connectOrCreate: {
                            where: {
                              nome: empresa.endereco.cidade
                            },
                            create: {
                              nome: empresa.endereco.cidade,
                              ufs: {
                                connectOrCreate: {
                                  where: {
                                    nome: empresa.endereco.uf
                                  },
                                  create: {
                                    nome: empresa.endereco.uf
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        paciente: {
          connectOrCreate: {
            where: {
              cpf: paciente.cpf
            },
            create: {
              cpf: paciente.cpf,
              dataNascimento: paciente.dataNascimento,
              usuario: {
                connectOrCreate: {
                  where: {
                    email: paciente.usuario.email
                  },
                  create: {
                    nome: paciente.usuario.nome,
                    email: paciente.usuario.email,
                    senha: (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.hashSync)(paciente.cpf, 12),
                    grupo: {
                      connectOrCreate: {
                        where: {
                          nome: paciente.usuario.grupo
                        },
                        create: {
                          nome: paciente.usuario.grupo
                        }
                      }
                    }
                  }
                }
              },
              convenio: {
                connectOrCreate: {
                  where: {
                    codigoIdentificacao: paciente.convenio.codigoIdentificacao
                  },
                  create: {
                    codigoIdentificacao: paciente.convenio.codigoIdentificacao,
                    produto: paciente.convenio.produto,
                    plano: paciente.convenio.plano,
                    cobertura: paciente.convenio.cobertura,
                    acomodacao: paciente.convenio.acomodacao,
                    cns: paciente.convenio.cns,
                    empresa: paciente.convenio.empresa,
                    validade: paciente.convenio.validade
                  }
                }
              },
              endereco: {
                create: {
                  cep: paciente.endereco.cep,
                  logradouro: paciente.endereco.logradouro,
                  numero: paciente.endereco.numero,
                  complemento: paciente.endereco.complemento,
                  bairro: {
                    connectOrCreate: {
                      where: {
                        nome: paciente.endereco.bairro
                      },
                      create: {
                        nome: paciente.endereco.bairro,
                        cidade: {
                          connectOrCreate: {
                            where: {
                              nome: paciente.endereco.cidade
                            },
                            create: {
                              nome: paciente.endereco.cidade,
                              ufs: {
                                connectOrCreate: {
                                  where: {
                                    nome: paciente.endereco.uf
                                  },
                                  create: {
                                    nome: paciente.endereco.uf
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        medico: {
          connectOrCreate: {
            where: {
              crm: medico.crm
            },
            create: {
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
                    senha: (0,bcryptjs__WEBPACK_IMPORTED_MODULE_0__.hashSync)(medico.crm, 12),
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
          }
        },
        receita: {
          create: {
            medicamentos: {
              create: medicamentos
            }
          }
        }
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
        medico: {
          include: {
            especialidade: true
          }
        },
        receita: {
          include: {
            medicamentos: true
          }
        }
      }
    }); //retornando o resultado

    return res.status(201).json({
      sucesso: true,
      mensagem: "Registro inserido com sucesso!",
      receita: resultado
    });
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
var __webpack_exports__ = (__webpack_exec__(771));
module.exports = __webpack_exports__;

})();