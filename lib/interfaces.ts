export interface IPaciente {
    cpf: string
    dataNascimento: Date
    convenio: {
        produto: string
        codigoIdentificacao: string
        plano: string
        acomodacao: string
        cns: string
        cobertura: string
        empresa: string
        validade: string
    }
    endereco: {
        cep: string
        logradouro: string
        numero: string
        complemento: string
        bairro: string
        cidade: string
        uf: string
    }
    usuario: {
        nome: string
        email: string
        senha: string
        grupo: string
    }
}

export interface IMedico {
    crm: string
    especialidade: string
    usuario: {
        nome: string
        email: string
        senha: string
        grupo: string
    }
}

export interface IEmpresa {
    cnpj: string
    nome: string
    nomeFantasia: string
    telefone: string
    endereco: {
        cep: string
        logradouro: string
        numero: string
        complemento: string
        bairro: string
        cidade: string
        uf: string
    }
}

export interface IMedicamento {
    uso: string
    tratamento: string
    formula: string
    dosagem: string
    concentracao: string
    quantidade: number
    dias: number
    frequenciaH: number
    orientacoes: string
}

export interface IRemedio {
    gtin: string
    nome: string
    laboratorio: string
    imagemCaixa: string
    imagemCodigoBarras: string
    precoMin: number
    precoMed: number
    precoMax: number
    idProduto?: number
    registro?: string
    bula?: string
}

export interface IBula {
    idProduto?: number
    registro?: string
    bula?: string
}

export interface IRemedioComBula {
    remedio: IRemedio
    bula: IBula
}

export interface IGerenciamento {
    id: string
    dispensadorId: string
    pacienteId: string
    receitaId: string
    dataHora: Date
    recipiente: number
    status: string
    dataHoraConfirmacao: Date | null
}