export default function Receita() {
    const receita =
    {
        consultaId: "1e68ac78-7316-4e8f-a42e-f0d798666011",
        dataHora: "2021-10-06T16:10:30Z",
        empresa: {
            cnpj: "00.0000.0000/0000-00",
            nome: "União Médica Sociedade LTDA",
            nomeFantasia: "Nome da Instituição Médica",
            telefone: "(92) 3000-0000",
            endereco: {
                cep: "69050-002",
                complemento: "",
                numero: 10
            }
        },
        paciente: {
            cpf: "000.000.000-00",
            nome: "Maria da Silva Sauro ",
            dataNascimento: "1981-07-22T00:00:00Z",
            endereco: {
                cep: "69050-001",
                complemento: "",
                numero: 2525
            },
        },
        medicamentos: [
            {
                tratamento: "Infeção urinária",
                formula: "Amoxilina",
                formaTomar: {
                    uso: "Interno - Via Oral",
                    dosagem: "500mg",
                    concentracao: "1 comprimido",
                    quantidade: 21,
                    dias: 7,
                    frequenciaH: 8,
                    orientacoes: "Tomar 1 (um) comprimido, por via oral, a cada 8 (oito) horas, durante 7 (sete) dias"
                }
            }
        ]
    }
}