import {NextApiRequest, NextApiResponse} from "next";
import {IPaciente} from "../../../lib/interfaces";
import {hashSync} from 'bcryptjs';
import {prisma} from './../../../lib/db';
import {autenticado} from "../../../lib/autenticado";

export default autenticado(async function Pacientes(req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case 'POST':
            cadastrar(req, res);
            break;
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
});

export async function cadastrar(req: NextApiRequest, res: NextApiResponse) {
    const paciente: IPaciente = req.body;

    try{
        //verificando se foram fornecidos os dados
        if (!paciente){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer todos os dados'
            });
        }

        //verificando se o paciente já existe
        const consulta = await prisma.paciente.findUnique({
            where: {
                nome: paciente.nome
            }
        });

        if (!consulta) {
            //usuário não existe... criptografa a senha e cadastra no banco de dados
            const resultado = await prisma.paciente.create({
                data: {
                    nome: paciente.nome,
                    dataNascimento: paciente.dataNascimento,
                    usuario: {
                        connectOrCreate: {
                            where: {
                                email: paciente.usuario.email
                            },
                            create: {
                                email: paciente.usuario.email,
                                senha: hashSync(paciente.usuario.senha, 12),
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
                }
            });

            //retornando o resultado
            res.status(201).json({
                sucesso: true,
                mensagem: "Registro inserido com sucesso!",
                paciente: resultado,
            });
        } else {
            res.status(200).json({
                sucesso: true,
                mensagem: "Paciente já possui cadastro!",
                paciente: consulta,
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
    } finally {
        res.end();
    }
}