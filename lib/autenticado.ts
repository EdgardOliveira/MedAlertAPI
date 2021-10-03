import {verify} from 'jsonwebtoken';
import {NextApiHandler, NextApiRequest, NextApiResponse} from 'next';

export const autenticado = (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse,) => {
    if (req.headers.authorization!) {
        //esta pelo app
        verify(req.headers.authorization!, process.env.JWT_SECRET, (async function (err, decoded) {
            if (!err && decoded)
                return fn(req, res);

            return res.status(401).json({
                sucesso: false,
                mensagem: 'O token informado é inválido',
                erro: JSON.stringify(err),
            });
        }));
    }else{
        return res.status(401).json({
            sucesso: false,
            mensagem: 'Não foi enviado um token'
        });
    }
};