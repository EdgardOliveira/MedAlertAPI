import {NextApiRequest, NextApiResponse} from "next";
import {autenticado} from "../../../lib/autenticado";
import {prisma} from "../../../lib/db";
import {IGerenciamento} from "../../../lib/interfaces";

export default autenticado(async function gerenciamentos(req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case "GET":
            consultarReceita(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
});

async function consultarReceita(req: NextApiRequest, res: NextApiResponse) {
    const {receita} = req.query;

    try {
        //verificando se foi fornecido um código de receita
        if (!receita)
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Um código de receita deve ser fornecido'
            });

        //Consultando se a receita existe e se está pendente
        const consulta: IGerenciamento[] | undefined = await prisma.gerenciamento.findMany({
            where: {
                receitaId: {
                    equals: String(receita),
                },
                status: {
                    equals: 'PENDENTE',
                },
            },
        });

        return res.status(201).json({
            sucesso: true,
            mensagem: 'Dados recuperados com sucesso!',
            gerenciamentos: consulta
        });
    } catch (e) {
        if (e instanceof Error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Ocorreu um erro durante a tentativa de recuperação de gerenciamento',
                erro: e.message,
                enviado: req.query
            });
        }
    }
}