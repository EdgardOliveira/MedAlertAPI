import {autenticado} from "../../../lib/autenticado";
import {NextApiRequest, NextApiResponse} from "next";
import {JwtPayload, verify, VerifyErrors} from "jsonwebtoken";
import {prisma} from "../../../lib/db";

export default autenticado(async function consultas(req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case 'GET':
            obterTodas(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
});

export async function obterTodas(req: NextApiRequest, res: NextApiResponse) {
    const token: string | undefined = req.headers.authorization;

    let usuarioId: string | undefined;

    try {
        if (!token) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Um token precisa ser fornecido'
            });
        }else{
            verify(token, String(process.env.JWT_SECRET), function (err:VerifyErrors | null, decoded: JwtPayload | undefined) {
                usuarioId = decoded?.sub
            });
        }

        const paciente = await prisma.paciente.findUnique({
            where: {
                usuarioId: usuarioId
            }
        });

        //verificando se os campos foram fornecidos
        if (paciente == null) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer o id para recuperar os dados'
            })
        }

        const resultado = await prisma.consulta.findMany({
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