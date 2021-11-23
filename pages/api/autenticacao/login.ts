import {NextApiRequest, NextApiResponse} from "next";
import {compare} from "bcryptjs";
import {sign} from "jsonwebtoken";
import {prisma} from "../../../lib/db";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case 'POST':
            verificarCredenciais(req, res);
            break;
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
}

async function verificarCredenciais(req: NextApiRequest, res: NextApiResponse) {
    const {email, senha} = req.body;
    try {
        if (!email || !senha) {
            return await res.status(400).json({
                sucesso: false,
                mensagem: 'Preencha os campos obrigatórios.',
                enviado: req,
            });
        }

        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email
            },
        });

        if (usuario != null) {
            compare(senha, usuario.senha, async function (err, result) {
                if (!err && result) {
                    const claims = {sub: usuario.id, myPersonEmail: usuario.email};
                    const jwt = sign(claims, String(process.env.JWT_SECRET), {expiresIn: '1h'});

                    return res.status(200).json({
                        sucesso: true,
                        mensagem: 'Autenticado com sucesso!',
                        nome: usuario.nome,
                        email: usuario.email,
                        token: jwt
                    });
                } else {
                    return res.status(401).json({
                        sucesso: false,
                        mensagem: "Credenciais inválidas",
                        enviado: req.body
                    });
                }
            });
        } else {
            return res.status(401).json({
                sucesso: false,
                mensagem: "E-mail não encontrado no banco de dados",
                enviado: req.body
            });
        }
    } catch (e) {
        if (e instanceof Error) {
            res.status(405).json({
                sucesso: false,
                mensagem: "Ocorreu um erro ao tentar fazer login.",
                erro: e.message,
                req: req.body
            });
        }
    }
}