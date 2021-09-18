import {NextApiRequest, NextApiResponse} from "next";

export default function Receitas(req: NextApiRequest, res:NextApiResponse) {
    const metodo: string | undefined  = req.method;

    switch (metodo ) {
        case 'GET':
            obter(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Método: ${metodo} não é permitido para esta rota`);
    }
};

async function obter(req: NextApiRequest, res:NextApiResponse) {
    const { id } = req.query;

    const resultado = {
        estabelecimento: {
            cnpj: "04.612.990/0002-50",
            nome: "UNIMED DE MANAUS COOPERATIVA DE TRABALHO MEDICO LTDA",
            nomeFantasia: "UNIMED MANAUS",
            endereco: {
                logradouro: "Av. Constantino Nery",
                numero: "1413",
                complemento: "",
                bairro: "Chapada",
                cidade: "Manaus",
                uf: "AM"
            },
            telefone: "(92) 3212-2812"
        },
        dataHora: "2021-09-18T14:00:00",
        medico: {
            nome: "Adriano Augusto Pereira Machado",
            crm: "2131/AM",
            especialidade: "Urologista"
        },
        paciente: {
            nome: "Thiago Lins Froner",
            codigo: "111573115053008",
            convenio: "Instituto dos Transudos",
            acomodacao: "Apartamento",
            validade: "2025-10-31",
            idade: "24",
            endereco: {
                logradouro: "Av. Principal",
                numero: "4",
                complemento: "",
                bairro: "Parque 10",
                cidade: "Manaus",
                uf: "AM"
            },
        },
        prescricoes: [
            {
                id: 1,
                uso: "Oral",
                tratamento: "Anti-inflamatório",
                formula: "Ibuprofeno",
                dosagem: "6500mg",
                concentracao: "Comprimido",
                quantidade: 15,
                dias: 5,
                frequenciaH: 8,
                orientacoes: "Tomar comprimido por via oral",
            },
            {
                id: 2,
                uso: "Oral",
                tratamento: "Otite",
                formula: "Ciprofloxacino",
                dosagem: "500mg",
                concentracao: "Comprimido",
                quantidade: 14,
                dias: 7,
                frequenciaH: 12,
                orientacoes: "Tomar comprimido por via oral",
            },
            {
                id: 3,
                uso: "Retal",
                tratamento: "Paumolecência",
                formula: "Viagra",
                dosagem: "500mg",
                concentracao: "Comprimido",
                quantidade: 30,
                dias: 30,
                frequenciaH: 24,
                orientacoes: "Tomar sempre que coçar o cú",
            }
        ],
    }

    try {
        if (!id) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'É necessário fornecer um id para rercuperar os dados'
            })
        }

        // const resultado  = await prisma.receita.findMany({
        //     where: {
        //         id: id
        //     }
        // });

        res.status(200).json({
            sucesso: true,
            mensagem: "Registro específico recuperado com sucesso!",
            receita: resultado,
        });

    } catch (e) {
        if(e instanceof Error){
            res.status(500).json({
                sucesso: false,
                mensagem: 'Não conseguimos recuperar o registro específico',
                erro: e.message
            });
        }
    } finally {
        res.end();
    }
}