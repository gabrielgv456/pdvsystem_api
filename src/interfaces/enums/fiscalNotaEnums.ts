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
    Entrada = '0',
    Saida = '1'
}

export enum Ambiente {
    Normal = '1',
    Contingencia = '2',
    SCAN = '3',
    DPEC = '4',
    FSDA = '5',
    SVCAN = '6',
    SVCRS = '7',
    SVCSP = '8',
    OffLine = '9'
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
    RegimeNormal = '',
    SimplesNacional = 1,
    SimplesExcessoReceita = 2,
    RegimeNormalRepetido = 3
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
  

