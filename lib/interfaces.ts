export interface IPaciente {
    nome: string
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
        email: string
        senha: string
        grupo: string
    }
}

export interface IMedico {
    nome: string
    crm: string
    especialidade: string
    usuario: {
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