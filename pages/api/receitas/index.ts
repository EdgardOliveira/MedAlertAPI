import {NextApiRequest, NextApiResponse} from "next";
import {IEmpresa, IMedicamento, IMedico, IPaciente} from "../../../lib/interfaces";
import {hashSync} from "bcryptjs";
import {autenticado} from "../../../lib/autenticado";
import {prisma} from "../../../lib/db";

export default autenticado(async function (req: NextApiRequest, res: NextApiResponse) {
    const metodo: String | undefined = req.method;

    switch (metodo) {
        case 'POST':
            cadastrar(req, res);
            break;
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
});

async function cadastrar(req: NextApiRequest, res: NextApiResponse) {
    const empresa: IEmpresa | undefined = req.body.empresa;
    const paciente: IPaciente | undefined = req.body.paciente;
    const medico: IMedico | undefined = req.body.medico;
    const medicamentos: IMedicamento[] | undefined = req.body.receita.medicamentos;

    try {
        //verificando se os campos foram fornecidos
        if (!empresa || !paciente || !medico || !medicamentos) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer todos os dados'
            })
        }

        const resultado = await prisma.consulta.create({
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
                                                nome: empresa.endereco.bairro,
                                            },
                                            create: {
                                                nome: empresa.endereco.bairro,
                                                cidade: {
                                                    connectOrCreate: {
                                                        where: {
                                                            nome: empresa.endereco.cidade,
                                                        },
                                                        create: {
                                                            nome: empresa.endereco.cidade,
                                                            ufs: {
                                                                connectOrCreate: {
                                                                    where: {
                                                                        nome: empresa.endereco.uf,
                                                                    },
                                                                    create: {
                                                                        nome: empresa.endereco.uf
                                                                    },
                                                                },
                                                            },
                                                        }
                                                    },
                                                },
                                            }
                                        },
                                    },
                                },
                            },
                        },
                    },
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
                                        senha: hashSync(paciente.cpf, 12),
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
                                    },
                                },
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
                                                nome: paciente.endereco.bairro,
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
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
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
                                    },
                                },
                            },
                            usuario: {
                                connectOrCreate: {
                                    where: {
                                        email: medico.usuario.email
                                    },
                                    create: {
                                        nome: medico.usuario.nome,
                                        email: medico.usuario.email,
                                        senha: hashSync(medico.crm, 12),
                                        grupo: {
                                            connectOrCreate: {
                                                where: {
                                                    nome: medico.usuario.grupo
                                                },
                                                create: {
                                                    nome: medico.usuario.grupo
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                receita: {
                    create: {
                        medicamentos: {
                            create: medicamentos,
                        },
                    },
                },
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
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
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
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                medico: {
                    include: {
                        especialidade: true
                    },
                },
                receita: {
                    include: {
                        medicamentos: true
                    },
                },
            },
        });

        //retornando o resultado
        return res.status(201).json({
            sucesso: true,
            mensagem: "Registro inserido com sucesso!",
            receita: resultado,
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