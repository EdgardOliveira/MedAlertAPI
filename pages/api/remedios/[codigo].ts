import { Remedio } from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import { autenticado } from "../../../lib/autenticado";
import { prisma} from "../../../lib/db";

export default autenticado(async function Remedios(req: NextApiRequest, res: NextApiResponse) {
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

async function consultarRemedioBD(codigo: String) {
    console.log(`Foi solicitado a consulta de um remedio no banco de dados pelo GTIN/EAN: ${codigo}`);

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

async function cadastrarRemedioBD(remedio: Remedio) {
    console.log(`Foi solicitado o cadastro de um remédio no banco de dados \n${JSON.stringify(remedio, null, 4)}`);
    const remedioCadastrado = await prisma.remedio.create({
        data: remedio
    });

    if ( remedioCadastrado != null)
        console.log('Remédio cadastro com sucesso no banco de dados...');
    else
        console.log('O remédio não foi cadastro no banco de dados');

    return remedioCadastrado;
}

async function atualizarRemedioBD(remedio: Remedio) {
    console.log(`Foi solicitado a atualização de dados do remédio no banco de dados... GTIN: ${remedio.gtin}`);

    // try{
    //     const remedioAtualizado = await prisma.remedio.update({
    //         where: {
    //             gtin: String(remedio.gtin)
    //         },
    //         data: JSON.stringify(remedio)
    //     });
    //
    //     if (remedioAtualizado != null)
    //         console.log('Os dados do remédio foram atualizados no banco de dados...');
    //     else
    //         console.log('O remédio não foi atualizado no banco de dados');
    //     return remedioAtualizado;
    // } finally {
    //
    // }
    return remedio;
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

async function consultarBulaAPI(remedio: Remedio) {
    console.log(`Foi solicitado a bula do remédio ${remedio.nome}`);

    const nome = String(remedio.nome);
    //pega o primeiro nome antes do espaçamento
    const primeiroNome = nome.split(" ")[0];

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
    if (bula != null) {
        console.log(`A API Bula retornou os dados... \n${JSON.stringify(bula, null, 4)}`);

        //Considerando o primeiro resultado
        if (bula.content[0] != null) {
            //tem dados da bula... atualiza os campos referente a bula no JSON
            //Concatenando conteúdos
            let remedioBula = {
                ...remedio,
                idProduto: bula.content[0].idProduto,
                registro: bula.content[0].numeroRegistro,
                bula: bula.content[0].idBulaPacienteProtegido,
            };
            console.log('Atualizando dados da bula do remedio no banco de dados...');
            const remedioAtualizado = await atualizarRemedioBD(remedioBula);
            if (remedioAtualizado != null)
                console.log(`Dados da bula foram incluídos no registro do remédio... \n${JSON.stringify(remedioAtualizado, null, 4)}`);
            return remedioAtualizado;
        }
    } else {
        console.log('Não conseguimos a bula deste remedio...');
        return remedio;
    }
}

async function consultarRemedio(req: NextApiRequest, res: NextApiResponse) {
    const { codigo } = req.query;

    try {
        //verificando se foi fornecido um código GTIN/EAN
        if (!codigo)
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Um código deve ser fornecido'
            });

        //Consultando se o código GTIN/EAN já está registrado no banco de dados
        const consulta = await consultarRemedioBD(String(codigo));

        if (consulta != null) {
            //verifica se ja tem os dados da bula
            if (consulta.bula == null) {
                //dispara a consulta da bula do medicamento
                const remedio = await consultarBulaAPI(consulta)
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Dados consultados com sucesso!',
                    remedio: remedio
                });
            } else {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Dados consultados com sucesso!',
                    remedio: consulta
                });
            }
        } else {
            //Não foi encontrado... faz a consulta na CosmosAPI
            const cosmosJSON = await consultarCosmosAPI(String(codigo));
            if (cosmosJSON != null) {
                const remed = {
                    gtin: String(cosmosJSON.gtin),
                    nome: cosmosJSON.description,
                    laboratorio: cosmosJSON.brand.name,
                    imagemCaixa: cosmosJSON.thumbnail,
                    imagemCodigoBarras: cosmosJSON.barcode_image,
                    precoMin: cosmosJSON.min_price,
                    precoMed: cosmosJSON.avg_price,
                    precoMax: cosmosJSON.max_price,
                };

                // @ts-ignore
                const remedioCadastrado = await cadastrarRemedioBD(remed);
                if (remedioCadastrado.bula == null) {
                    //dispara a consulta da bula do remedio
                    const remedio = await consultarBulaAPI(remedioCadastrado)
                    return res.status(201).json({
                        sucesso: true,
                        mensagem: 'Dados cadastrados com sucesso!',
                        remedio: remedio
                    });
                } else {
                    return res.status(201).json({
                        sucesso: true,
                        mensagem: 'Dados cadastrados com sucesso!',
                        remedio: remedioCadastrado
                    });
                }
            } else {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: 'Dados não encontrados na COSMOS API!',
                });
            }
        }
    } catch (e: any) {
        return res.status(500).json({
            sucesso: false,
            mensagem: 'Ocorreu um erro durante a consulta do remédio',
            erro: e.message,
            enviado: req.query
        });
    }
}