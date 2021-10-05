import {NextApiRequest, NextApiResponse} from "next";
import {IMedico} from "../../../lib/interfaces";
import {hashSync} from 'bcryptjs';
import {prisma} from "../../../lib/db";
import {autenticado} from "../../../lib/autenticado";

export default autenticado(async function (req: NextApiRequest, res: NextApiResponse) {
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
    const medico: IMedico = req.body;

    try{
        //verificando se foram fornecidos os dados
        if (!medico){
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer todos os dados'
            });
        }

        //verificando se o paciente já existe
        const consulta = await prisma.medico.findUnique({
            where: {
                crm: medico.crm
            }
        });

        if (!consulta) {
            //usuário não existe... criptografa a senha e cadastra no banco de dados
            const resultado = await prisma.medico.create({
                data: {
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
                                senha: hashSync(medico.usuario.senha, 12),
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
                        },
                    },
                },
            });

            //retornando o resultado
            res.status(201).json({
                sucesso: true,
                mensagem: "Registro inserido com sucesso!",
                medico: resultado,
            });
        } else {
            res.status(200).json({
                sucesso: true,
                mensagem: "Médico já possui cadastro!",
                medico: consulta,
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