import {NextApiRequest, NextApiResponse} from "next";
import {autenticado} from "../../../lib/autenticado";
import {prisma} from "../../../lib/db";
import {IGerenciamento} from "../../../lib/interfaces";

export default autenticado(async function grupos(req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case 'POST':
            cadastrar(req, res);
            break;
        case 'PUT':
            atualizar(req, res);
            break;
        default:
            res.setHeader('Allow', ['POST', 'PUT'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
});

export async function cadastrar(req: NextApiRequest, res: NextApiResponse) {
    const gerenciamento: IGerenciamento = req.body;

    try {
        //verificando se foram fornecidos os dados
        if (!gerenciamento) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer todos os dados'
            });
        }

        const resultado = await prisma.gerenciamento.create({
            data: {
                dispensadorId: gerenciamento.dispensadorId,
                pacienteId: gerenciamento.pacienteId,
                receitaId: gerenciamento.receitaId,
                dataHora: gerenciamento.dataHora,
                recipiente: gerenciamento.recipiente,
                status: 'PENDENTE',
                dataHoraConfirmacao: null
            }
        });

        //retornando o resultado
        return res.status(201).json({
            sucesso: true,
            mensagem: "Registro inserido com sucesso!",
            gerenciamento: resultado,
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

export async function atualizar(req: NextApiRequest, res: NextApiResponse) {
    const {gerenciamentoId, status, dataHoraConfirmacao} = req.body;

    try {
        //verificando se foram fornecidos os dados
        if (!gerenciamentoId || !status || !dataHoraConfirmacao) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer todos os dados'
            });
        }

        const resultado = await prisma.gerenciamento.updateMany({
            where: {
                id: String(gerenciamentoId),
            },
            data: {
                dataHoraConfirmacao: dataHoraConfirmacao,
                status: status
            },
        });

        //retornando o resultado
        return res.status(200).json({
            sucesso: true,
            mensagem: "Registro atualizado com sucesso!",
            gerenciamento: resultado,
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