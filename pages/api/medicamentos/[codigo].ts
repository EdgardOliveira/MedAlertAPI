import {Medicamento} from "@prisma/client";
import type {NextApiRequest, NextApiResponse} from "next";
import prisma from "../../../client/client";

export default async function Medicamentos(req: NextApiRequest, res: NextApiResponse) {
    const metodo = req.method;

    switch (metodo) {
        case "GET":
            await consultarMedicamento(req, res);
            break;
        default:
            return res.status(405).json({
                sucesso: false,
                mensagem: 'Método não permitido para esta rota'
            });
    }
}

async function consultarMedicamentoBD(codigo: String) {
    console.log(`Foi solicitado a consulta de um medicamento no banco de dados pelo GTIN/EAN: ${codigo}`);

    const resultado = await prisma.medicamento.findUnique({
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

async function cadastrarMedicamentoBD(medicamento: Medicamento) {
    console.log(`Foi solicitado o cadastro de um medicamento no banco de dados \n${JSON.stringify(medicamento, null, 4)}`);
    const medicamentoCadastrado = await prisma.medicamento.create({
        data: medicamento
    });

    if (medicamentoCadastrado != null)
        console.log('Medicamento cadastro com sucesso no banco de dados...');
    else
        console.log('O medicamento não foi cadastro no banco de dados');

    return medicamentoCadastrado;
}

async function atualizarMedicamentoBD(medicamento: Medicamento) {
    console.log('Foi solicitado a atualização de dados do medicamento no banco de dados...');

    const medicamentoAtualizado = await prisma.medicamento.update({
        where: {
            gtin: medicamento.gtin
        },
        data: medicamento
    });

    if (medicamentoAtualizado != null)
        console.log('Os dados do medicamento foram atualizados no banco de dados...');
    else
        console.log('O medicamento não foi atualizado no banco de dados');

    return medicamentoAtualizado;
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

async function consultarBulaAPI(medicamento: Medicamento) {
    console.log(`Foi solicitado a bula do medicamento ${medicamento.nome}`);

    const nome = String(medicamento.nome);
    //pega o primeiro nome antes do espaçamento
    const primeiroNome = nome.split(" ")[0];

    console.log(`Solicitando dados da bula do medicamento por ${primeiroNome}`);

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
            let medicamentoBula = {
                ...medicamento,
                idProduto: bula.content[0].idProduto,
                registro: bula.content[0].numeroRegistro,
                bula: bula.content[0].idBulaPacienteProtegido,
            };
            console.log('Atualizando dados da bula do medicamento no banco de dados...');
            const medicamentoAtualizado = await atualizarMedicamentoBD(medicamentoBula);
            if (medicamentoAtualizado != null)
                console.log(`Dados da bula foram incluídos no registro do medicamento... \n${JSON.stringify(medicamentoAtualizado, null, 4)}`);
            return medicamentoAtualizado;
        }
    } else {
        console.log('Não conseguimos a bula deste medicamento...');
        return medicamento;
    }
}

async function consultarMedicamento(req: NextApiRequest, res: NextApiResponse) {
    const {codigo} = req.query;

    try {
        //verificando se foi fornecido um código GTIN/EAN
        if (!codigo)
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Um código deve ser fornecido'
            });

        //Consultando se o código GTIN/EAN já está registrado no banco de dados
        const consulta = await consultarMedicamentoBD(String(codigo));

        if (consulta != null) {
            //verifica se ja tem os dados da bula
            if (consulta.bula == null) {
                //dispara a consulta da bula do medicamento
                const medicamento = await consultarBulaAPI(consulta)
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Dados consultados com sucesso!',
                    medicamento: medicamento
                });
            } else {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Dados consultados com sucesso!',
                    medicamento: consulta
                });
            }
        } else {
            //Não foi encontrado... faz a consulta na CosmosAPI
            const cosmosJSON = await consultarCosmosAPI(String(codigo));
            if (cosmosJSON != null) {
                const med = {
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
                const medicamentoCadastrado = await cadastrarMedicamentoBD(med);
                if (medicamentoCadastrado.bula == null) {
                    //dispara a consulta da bula do medicamento
                    const medicamento = await consultarBulaAPI(medicamentoCadastrado)
                    return res.status(201).json({
                        sucesso: true,
                        mensagem: 'Dados cadastrados com sucesso!',
                        medicamento: medicamento
                    });
                } else {
                    return res.status(201).json({
                        sucesso: true,
                        mensagem: 'Dados cadastrados com sucesso!',
                        medicamento: medicamentoCadastrado
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
            mensagem: 'Ocorreu um erro durante a consulta de medicamento',
            erro: e.message,
            enviado: req.query
        });
    }
}