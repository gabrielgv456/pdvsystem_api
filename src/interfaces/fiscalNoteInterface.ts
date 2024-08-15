import { Ambiente, CodigoSituacaoTributaria, Crt, finalidadeNFe, FormaPagamento, IndFinal, IndIEDest, IndIntermediador, OrigemMercadoria, TipoEmissao, TipoEntrega, TipoFrete, tipoSaida } from "./enums/fiscalNotaEnums";

// Tipos de endereço
interface Endereco {
    fone: string;
    CEP: number;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    codMunicipio: number;
    nomeMunicipio: string;
    UF: string;
}

// Tipos de emitente e destinatário
interface Emitente {
    CNPJCPF: string;
    IE: string;
    razaoSocial: string;
    nomeFantasia: string;
    endereco: Endereco;
    CRT: Crt;
}

interface Destinatario {
    nome: string;
    CNPJCPF: string;
    indIEDest: number | IndIEDest;
    IE: string;
    ISUF: string;
    endereco: Endereco;
}

// Tipos de veiculo, combustivel e imposto
interface Veiculo {
    tipoOperacao: string;
    chassi: string;
    cor: string;
    pot: string;
    cilin: string;
    pesoL: string;
    pesoB: string;
    nSerie: string;
    tipoCombustivel: string;
    motor: string;
    CMT: string;
    dist: string;
    anoMod: number;
    anoFab: number;
    tipoPint: string;
    tipoVeic: number;
    espVeic: number;
    VIN: string;
    condicaoVeiculo: string;
    modelo: string;
}

interface CIDE {
    qBCprod: number;
    aliqProd: number;
    vCIDE: number;
}

interface ICMS {
    vBCICMS: number;
    vICMS: number;
    vBCICMSST: number;
    vICMSST: number;
}

interface ICMSInter {
    vBCICMSSTDest: number;
    vICMSSTDest: number;
}

interface ICMSCons {
    vBCICMSSTCons: number;
    vICMSSTCons: number;
    UFcons: string;
}

interface Combustivel {
    codigoANP: number;
    codIF: string;
    qTemp: number;
    UFcons: string;
    CIDE: CIDE;
    ICMS: ICMS;
    ICMSInter: ICMSInter;
    ICMSCons: ICMSCons;
}

interface Imposto {
    vTotTrib: number;
    origemMercadoria: OrigemMercadoria;
    ICMS: {
        CST?: string;
        CSOSN?: string;
        modBC: string;
        vBC: number;
        pICMS: number;
        vICMS: number;
        pMVAST: number;
        pRedBCST: number;
        vBCST: number;
        pICMSST: number;
        vICMSST: number;
        pRedBC: number;
        pCredSN: number;
        vBCFCPST: number;
        pFCPST: number;
        vFCPST: number;
        pFCP: number;
        vFCP: number;
        vBCSTRet: number;
        pST: number;
        vICMSSubstituto: number;
        vICMSSTRet: number;
        vBCFCPSTRet: number;
        pFCPSTRet: number;
        vFCPSTRet: number;
        pRedBCEfet: number;
        vBCEfet: number;
        pICMSEfet: number;
        vICMSEfet: number;
        vICMSSTDeson: number;
    };
    ICMSUFDest: {
        vBCUFDest: number;
        pFCPUFDest: number;
        pICMSUFDest: number;
        pICMSInter: number;
        pICMSInterPart: number;
        vFCPUFDest: number;
        vICMSUFDest: number;
        vICMSUFRemet: number;
    };
    II?: {
        vBc: number;
        vDespAdu: number;
        vII: number;
        vIOF: number;
    };
    PIS: {
        CST: string;
        vBC: number;
        pPIS: number;
        vPIS: number;
        qBCProd: number;
        vAliqProd: number;
    };
    PISST?: {
        vBc: number;
        pPis: number;
        qBCProd: number;
        vAliqProd: number;
        vPIS: number;
        indSomaPISST: string;
    };
    COFINS: {
        CST: string;
        vBC: number;
        pCOFINS: number;
        vCOFINS: number;
        qBCProd: number;
        vAliqProd: number;
    };
    COFINSST?: {
        vBC: number;
        pCOFINS: number;
        qBCProd: number;
        vAliqProd: number;
        vCOFINS: number;
        indSomaCOFINSST: string;
    };
    IPI?: {
        CST: string;
        clEnq: string
        CNPJProd: string
        cSelo: string
        qSelo: number
        cEnq: string
        vBC: number
        qUnid?: number
        vUnid?: number
        pIPI: number
        vIPI: number
    }
}

// Tipos de produto
interface Produto {
    codigo: string;
    EAN: string;
    descricao: string;
    NCM: string;
    extIPI: string;
    CFOP: string;
    unidade: string;
    quantidade: number;
    precoVenda: number;
    valorUnitario: number;
    EANTrib: string;
    unidadeTrib: string;
    quantidadeTrib: number;
    valorUnitarioTrib: number;
    valorOutro?: number;
    valorFrete?: number;
    valorSeguro?: number;
    valorDesconto: number;
    CEST?: string;
    infAdProd: string;
    codBarra: string;
    codBarraTrib: string;
    veiculo?: Veiculo;
    combustivel?: Combustivel;
    imposto: Imposto;
}

// Tipos de total

interface Total {
    ICMS: {
        vBC: number;
        vICMS: number;
        vBCST: number;
        vST: number;
        vProd: number;
        vFrete: number;
        vSeg: number;
        vDesc: number;
        vII: number;
        vIPI: number;
        vPIS: number;
        vCOFINS: number;
        vOutro: number;
        vNF: number;
        vTotTrib: number;
        vFCPUFDest: number;
        vICMSUFDest: number;
        vICMSUFRemet: number;
        vFCPST: number;
        vFCPSTRet: number;
    };
    retTrib?: {
        vRetPIS: number;
        vRetCOFINS: number;
        vRetCSLL: number;
        vBCIRRF: number;
        vIRRF: number;
        vBCRetPrev: number;
        vRetPrev: number;
    };
}

// Tipos de transportadora
interface Transportadora {
    modFrete: TipoFrete;
    CNPJCPF: string;
    nome: string;
    IE: string;
    ender: string;
    mun: string;
    UF: string;
    retTransp: {
        vServ: number;
        vBCRet: number;
        pICMSRet: number;
        vICMSRet: number;
        CFOP: string;
        munFG: number;
    };
    volume: {
        qVol: number;
        esp: string;
        marca: string;
        nVol: string;
        pesoL: number;
        pesoB: number;
    };
}

// Tipos de cobrança
interface CobrancaFat {
    numero: string;
    vOrig: number;
    vDesc: number;
    vLiq: number;
}

interface CobrancaDuplicata {
    numero: string;
    vencimento: string;
    valor: number;
}

// Tipos de informações adicionais
interface InfoAdicional {
    infComplementar: string;
    infAdicionalFisco: string;
    obsComplementar?: { campo: string; texto: string }[];
    obsFisco?: { campo: string; texto: string }[];
}

// Tipos de exportação e compra
interface Exporta {
    UFembarq: string;
    locEmbarq: string;
}

interface Compra {
    nEmp: string;
    ped: string;
    cont: string;
}

// Tipos de pagamento
interface Pagamento {
    condicao: string;
    forma: string;
    valor: number;
    integrado?: boolean;
    tipoIntegracao?: string;
    CNPJ?: string;
    bandeiraCartao?: string;
    codAutorizacao?: string;
}

// Tipos de intermediador
interface InfoIntermediador {
    CNPJ: string;
    idCadIntTran: string;
}

// Tipo principal para NFe
export interface CreateFiscalNoteInterface {
    natOp: string;
    nNF: number;
    indPag: string | FormaPagamento;
    tpNF: tipoSaida;
    tpEmis: TipoEmissao;
    serie: number,
    ambiente: Ambiente;
    indFinal: IndFinal;
    cUF: string;
    cMunFG: number;
    finalidadeNFe: finalidadeNFe;
    indIntermediador?: IndIntermediador;
    emitente: Emitente;
    destinatario: Destinatario;
    entrega: Entrega;
    produtos: Produto[];
    total: Total;
    transportadora?: Transportadora;
    cobrancaFat?: CobrancaFat;
    cobrancaDuplicata?: CobrancaDuplicata[];
    infAdicional: InfoAdicional;
    exporta?: Exporta;
    compra?: Compra;
    pagamento: Pagamento[];
    infIntermediador?: InfoIntermediador;
}

interface Entrega {
    tipo: TipoEntrega;
    CNPJCPF: string;
    CEP: number;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    codMunicipio: number;
    nomeMunicipio: string;
    UF: string;
}

export type NFeResponse = {
    NFe: string;
    tpAmb: string;
    verAplic: string;
    cStat: string;
    cUF: string;
    xMotivo: string;
    cMsg: string;
    xMsg: string;
    Recibo: string;
    Protocolo: string;
    RetWs: string;
    RetornoWS: string;
    pathSave: string;
    xml: string;
    profile: string
}

export type danfeGenReqType = {
    profile: string,
    NFe: string,
    xml: string
}