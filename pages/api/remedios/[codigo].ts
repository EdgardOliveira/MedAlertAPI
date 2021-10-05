import {NextApiRequest, NextApiResponse} from "next";
import {Remedio} from "@prisma/client";
import {autenticado} from "../../../lib/autenticado";
import {prisma} from "../../../lib/db";
import {IBula, IRemedio} from "../../../lib/interfaces";

export default autenticado(async function (req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case "GET":
            consultarRemedio(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
});

async function consultarRemedio(req: NextApiRequest, res: NextApiResponse) {
    const {codigo} = req.query;

    try {
        //verificando se foi fornecido um código GTIN/EAN
        if (!codigo)
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Um código de barras deve ser fornecido'
            });

        //Consultando se o código GTIN/EAN já está registrado no banco de dados
        const consulta: Remedio | null = await consultarRemedioBD(String(codigo));

        if (!consulta) {
            //Não foi encontrado no banco de dados... faz a consulta na CosmosAPI
            const cosmosJSON = await consultarCosmosAPI(String(codigo));
            let remed: IRemedio;
            if (cosmosJSON != null) {
                //prepara o remédio para cadastro
                remed = {
                    gtin: String(cosmosJSON.gtin),
                    nome: cosmosJSON.description,
                    laboratorio: cosmosJSON.brand.name,
                    imagemCaixa: cosmosJSON.thumbnail,
                    imagemCodigoBarras: cosmosJSON.barcode_image,
                    precoMin: cosmosJSON.min_price,
                    precoMed: cosmosJSON.avg_price,
                    precoMax: cosmosJSON.max_price,
                };

                //Ja tem o remédio... consulta os dados da bula
                const dadosBula = await consultarBulaAPI(remed);

                if (dadosBula != null){
                    //tem dados da bula... mesclar com o remédio e cadastrar
                    remed = {
                        ...remed,
                        idProduto: dadosBula.idProduto,
                        registro: dadosBula.registro,
                        bula: dadosBula.bula
                    }
                    const resultado = await cadastrarRemedioBD(remed);
                    return res.status(201).json({
                        sucesso: true,
                        mensagem: 'Dados cadastrados com sucesso!',
                        remedio: resultado
                    });
                }else{
                    //cadastra somente os dados do remédio
                    const resultado = await cadastrarRemedioBD(remed);
                    return res.status(201).json({
                        sucesso: true,
                        mensagem: 'Dados cadastrados com sucesso!',
                        remedio: resultado
                    });
                }
            } else {
                //A API cosmos não retornou dados
                return res.status(204).json({
                    sucesso: true,
                    mensagem: 'Não conseguimos obter dados sobre o remédio!',
                    remedio: null
                });
            }
        } else {
            //Foi encontrado no banco de dados
            return res.status(200).json({
                sucesso: true,
                mensagem: 'Dados consultados com sucesso!',
                remedio: consulta
            });
        }
    } catch (e) {
        if (e instanceof Error) {
            return res.status(500).json({
                sucesso: false,
                mensagem: 'Ocorreu um erro durante a consulta do remédio',
                erro: e.message,
                enviado: req.query
            });
        }
    }
}

async function consultarRemedioBD(codigo: String) {
    console.log(`Foi solicitado a consulta de um remédio no banco de dados pelo GTIN/EAN: ${codigo}`);

    const resultado = await prisma.remedio.findUnique({
        where: {
            gtin: String(codigo)
        }
    });

    if (resultado != null)
        console.log('Os dados para este código foram encontrados no banco de dados...');
    else
        console.log('Os dados para este código não foram encontrados no banco de dados...');

    return resultado;
}

async function consultarCosmosAPI(codigo: String) {
    console.log(`Estamos solicitando dados do GTIN/EAN: ${codigo} para a API COSMOS...`);

    const resultado = await fetch(`${process.env.COSMOS_BASE_URL}/gtins/${codigo}`, {
        method: 'GET',
        headers: {
            'Aceppt': '*/*',
            'Content-Type': 'application/json;charset=utf-8',
            'User-Agent': 'Cosmos-API-Request',
            'X-Cosmos-Token': `${process.env.COSMOS_TOKEN}`
        },
        mode: 'cors',
        cache: 'default'
    });

    const json = await resultado.json();
    console.log(`A API COSMOS devolveu a resposta... \n${JSON.stringify(json, null, 4)}`);

    return json;
}

async function cadastrarRemedioBD(remedio: IRemedio) {
    console.log(`Foi solicitado o cadastro de um remédio no banco de dados \n${JSON.stringify(remedio, null, 4)}`);
    const remedioCadastrado = await prisma.remedio.create({
        data: remedio
    });

    if (remedioCadastrado != null)
        console.log('Remédio cadastro com sucesso no banco de dados...');
    else
        console.log('O remédio não foi cadastro no banco de dados');

    return remedioCadastrado;
}

async function consultarBulaAPI(remedio: IRemedio) {
    console.log(`Foi solicitado a bula do remédio ${remedio.nome}`);

    //pega o primeiro nome antes do espaçamento
    const primeiroNome = remedio.nome.split(" ")[0];

    console.log(`Solicitando dados da bula do remédio por ${primeiroNome}`);

    const resultado = await fetch(`${process.env.BULA_BASE_URL}/pesquisar?nome=${primeiroNome}&pagina=1`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        mode: 'cors',
        cache: 'default'
    });

    const bula = await resultado.json();

    let dadosBula: IBula = {
        idProduto: 0,
        registro: "",
        bula: ""
    }

    if (bula != null) {
        console.log(`A API Bula retornou os dados... \n${JSON.stringify(bula, null, 4)}`);

        //Considerando o primeiro resultado
        if (bula.content[0] != null) {
            //tem dados da bula... atualiza os campos referente a bula no JSON
            dadosBula = {
                idProduto: bula.content[0].idProduto,
                registro: bula.content[0].numeroRegistro,
                bula: bula.content[0].idBulaPacienteProtegido,
            };

            console.log(`Dados da bula foram incluídos no registro do remédio... \n${JSON.stringify(dadosBula, null, 4)}`);
            return dadosBula;
        }
    } else {
        console.log('Não conseguimos a bula deste remedio...');
        return dadosBula;
    }
}
