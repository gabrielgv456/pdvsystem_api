export enum finalidadeNFe {
    Normal = '1',
    Complementar = '2',
    Ajuste = '3',
    Devolucao = '4'
}

export enum FormaPagamento {
    Vista = '0',
    Prazo = '1',
    Outras = '2',
    Nenhum = ''
}

export enum TipoEmissao {
    Normal = '1', // Emissão normal (não em contingência)
    ContingenciaFSIA = '2', // Contingência FS-IA, com impressão do DANFE em formulário de segurança
    ContingenciaSCAN = '3', // Contingência SCAN (Sistema de Contingência do Ambiente Nacional)
    ContingenciaDPEC = '4', // Contingência DPEC (Declaração Prévia da Emissão em Contingência)
    ContingenciaFSDA = '5', // Contingência FS-DA, com impressão do DANFE em formulário de segurança
    ContingenciaSVCAN = '6', // Contingência SVC-AN (SEFAZ Virtual de Contingência do AN)
    ContingenciaSVCRS = '7'  // Contingência SVC-RS (SEFAZ Virtual de Contingência do RS)
}


export enum Ambiente {
    Producao = '1',
    Homologacao = '2',
}

export enum IndFinal {
    NaoConsumidorFinal = '0',
    ConsumidorFinal = '1'
}

export enum IndIntermediador {
    SemOperacao = '',
    OperacaoSemIntermediador = '0',
    OperacaoComIntermediador = '1'
}
export enum Crt {
    SimplesNacional = 1,
    SimplesExcessoReceita = 2,
    RegimeNormal = 3
}

export enum TipoFrete {
    mfContaEmitente = '0',
    mfContaDestinatario = '1',
    mfContaTerceiros = '2',
    mfProprioRemetente = '3',
    mfProprioDestinatario = '4',
    mfSemFrete = '9'
}

export enum IndPresencaComprador {
    pcNao = '0',
    pcPresencial = '1',
    pcInternet = '2',
    pcTeleatendimento = '3',
    pcEntregaDomicilio = '4',
    pcPresencialForaEstabelecimento = '5',
    pcOutros = '9'
}


export enum IndIEDest {
    Contribuinte = '1',
    Isento = '2',
    NaoContribuinte = '9'
}

export enum TipoEntrega {
    Retirada = 'Retirada',
    Entrega = 'Entrega'
}

export enum OrigemMercadoria {
    Nacional = 0,
    EstrangeiraImportacaoDireta = 1,
    EstrangeiraAdquiridaBrasil = 2,
    NacionalConteudoImportacaoSuperior40 = 3,
    NacionalProcessosBasicos = 4,
    NacionalConteudoImportacaoInferiorIgual40 = 5,
    EstrangeiraImportacaoDiretaSemSimilar = 6,
    EstrangeiraAdquiridaBrasilSemSimilar = 7,
    NacionalConteudoImportacaoSuperior70 = 8,
    ReservadoParaUsoFuturo = 9,
    Vazio = ''
}

export enum CodigoSituacaoTributaria {
    Vazio = '',
    ZeroZero = '00',
    Dez = '10',
    Vinte = '20',
    Trinta = '30',
    Quarenta = '40',
    QuarentaUm = '41',
    QuarentaCinco = '45',
    Cinquenta = '50',
    CinquentaUm = '51',
    Sessenta = '60',
    Setenta = '70',
    Oitenta = '80',
    OitentaUm = '81',
    Noventa = '90',
    NoventaUm = '91',
    ICMSSN = 'SN',
    ParteDez = '10part',
    ParteNoventa = '90part',
    RepQuarentaUm = '41rep',
    RepSessenta = '60rep',
    Dois = '02',
    Quinze = '15',
    CinquentaTres = '53',
    SessentaUm = '61'
}

export enum tipoSaida {
    Entrada = 0,
    Saida = 1
}

export enum PaymentType {
    Dinheiro = '01',
    Cheque = '02',
    CartaoCredito = '03',
    CartaoDebito = '04',
    CreditoLoja = '05',
    ValeAlimentacao = '10',
    ValeRefeicao = '11',
    ValePresente = '12',
    ValeCombustivel = '13',
    DuplicataMercantil = '14',
    BoletoBancario = '15',
    DepositoBancario = '16',
    PagamentoInstantaneo = '17',
    TransfBancario = '18',
    ProgramaFidelidade = '19',
    SemPagamento = '90',
    RegimeEspecial = '98',
    Outro = '99'
}


export enum fiscalModels {
    nfe55 = 1,
    nfce65 = 2
}

export enum fiscalSeries {
    serie1 = 1
}

export enum fiscalStatusNf {
    emitida = 1,
    cancelada = 2,
    inutilizada = 3
}