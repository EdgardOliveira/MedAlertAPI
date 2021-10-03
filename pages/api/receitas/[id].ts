import {NextApiRequest, NextApiResponse} from "next";
import { prisma} from "../../../lib/db";

export default async function ReceitaEspecifica(req: NextApiRequest, res: NextApiResponse) {
    const metodo: String | undefined = req.method;

    switch (metodo) {
        case 'GET':
            consultarPorId(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
}

async function consultarPorId(req: NextApiRequest, res: NextApiResponse) {
    const id: string | string[] = req.query.id;

    try {
        //verificando se os campos foram fornecidos
        if (!id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer o id para recuperar os dados'
            })
        }

        const resultado = await prisma.receita.findUnique({
            where: {
                id: String(id)
            },
            include: {
                consultas: {
                    include: {
                        empresa:{
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
                        medico:{
                            include: {
                                especialidade: true
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
                            }
                        },
                        receita: {
                            include: {
                                medicamentos: true
                            }
                        }
                    }
                }
            }
        });

        let feedback = {
            sucesso: false,
            mensagem: "",
            dados: resultado
        };

        if (resultado != null){
            feedback.sucesso = true;
            feedback.mensagem = "Registro recuperado com sucesso!";
        }else{
            feedback.sucesso = false;
            feedback.mensagem = `Registro ${id} não foi encontrado no banco de dados.`;
        }

        if (feedback.sucesso){
            //retornando o resultado
            res.status(200).json(feedback);
        }else{
            res.status(404).json(feedback);
        }
    } catch
        (e) {
        if (e instanceof Error) {
            res.status(500).json({
                sucesso: false,
                mensagem: 'Não conseguimos recuperar o registro específico',
                erro: e.message
            });
        }
    } finally {
        res.end();
    }
}