import {NextApiRequest, NextApiResponse} from "next";
import {compare} from "bcryptjs";
import {sign} from "jsonwebtoken";
import {prisma} from "../../../lib/db";
import { Usuario } from "@prisma/client";

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
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
                mensagem: 'Preencha todos os campos obrigatórios.',
                enviado: req,
            });
        }

        const usuario: Usuario | null = await prisma.usuario.findUnique({
            where: {
                email: email,
            }
        });

        if (!usuario) {
            return await res.status(400).json({
                sucesso: false,
                mensagem: 'Credenciais inválidas',
                enviado: req,
            });
        }else{
            compare(senha, usuario.senha, async function (err, result) {
                if (!err && result) {
                    const claims = {sub: usuario.id, email: usuario.email};
                    const jwt = sign(claims, String(process.env.JWT_SECRET), {expiresIn: '1h'});
                    return res.status(200).json({
                        sucesso: true,
                        mensagem: 'Autenticado com sucesso!',
                        token: jwt
                    });
                } else {
                    return res.status(401).json({
                        sucesso: false,
                        mensagem: "As credenciais fornecidas são inválidas",
                        enviado: req.body
                    });
                }
            });
        }
    } catch (e) {
        if (e instanceof Error) {
            return res.status(405).json({
                sucesso: false,
                mensagem: "Ocorreu um erro ao tentar fazer login.",
                erro: e.message,
                req: req.body
            });
        }
    }
}