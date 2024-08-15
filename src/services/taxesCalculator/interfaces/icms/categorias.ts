/**
 * +---------------------------------------+
 * |            Regime normal              |
 * +---------------------------------------+
 */
export interface IIcms00 {
    calculaBaseIcmsProprio(): number;
    calculaValorIcmsProprio(): number;
    getAliquotaIcmsProprio(): number;
}

export interface IIcms10 {
    calculaBaseIcmsProprio(): number;
    calculaValorIcmsProprio(): number;
    calculaBaseIcmsST(): number;
    calculaValorIcmsST(): number;
    calculaValorIcmsSTDesonerado(): number;
    getAliquotaIcmsProprio(): number;
    getAliquotaIcmsST(): number;
}

export interface IIcms20 {
    calculaBaseReduzidaIcmsProprio(): number;
    calculaValorIcmsProprio(): number;
    calculaValorIcmsDesonerado(): number;
    getAliquotaIcmsProprio(): number;
}

export interface IIcms30 {
    calculaBaseIcmsProprio(): number;
    calculaValorIcmsProprio(): number;
    calculaBaseIcmsST(): number;
    calculaValorIcmsST(): number;
    calculaValorIcmsDesonerado(): number;
    getAliquotaIcmsProprio(): number;
    getAliquotaIcmsST(): number;
}

export interface IIcms51 {
    calculaBaseIcmsProprio(): number;
    calculaValorIcmsOperacao(): number;
    calculaValorIcmsDiferido(): number;
    calculaValorIcmsProprio(): number;
    getAliquotaIcmsProprio(): number;
}

export interface IIcms70 {
    calculaBaseIcmsProprio(): number;
    calculaValorIcmsProprio(): number;
    calculaValorIcmsProprioDesonerado(): number;
    calculaBaseIcmsST(): number;
    calculaValorIcmsST(): number;
    calculaValorIcmsSTDesonerado(): number;
    getAliquotaIcmsProprio(): number;
    getAliquotaIcmsST(): number;
}

export interface IIcms90 {
    calculaBaseIcmsProprio(): number;
    calculaBaseReduzidaIcmsProprio(): number;
    calculaValorIcmsProprio(): number;
    calculaValorIcmsProprioBaseReduzida(): number;
    calculaValorIcmsProprioDesonerado(): number;
    calculaBaseICMSST(): number;
    calculaBaseReduzidaICMSST(): number;
    calculaValorIcmsST(): number;
    calculaValorIcmsSTBaseReduzida(): number;
    calculaValorIcmsSTDesonerado(): number;
    getAliquotaIcmsProprio(): number;
    getAliquotaIcmsST(): number;
}

/**
 * +---------------------------------------+
 * |            Regime Simples             |
 * +---------------------------------------+
 */
export interface IIcms101 {
    calculaBaseIcmsProprio(): number;
    calculaValorCreditoSN(): number;
}

export interface IIcms201 {
    calculaBaseIcmsProprio(): number;
    calculaValorIcmsProprio(): number;
    calculaValorCreditoSN(): number;
    calculaBaseIcmsST(): number;
    calculaValorIcmsST(): number;
    getAliquotaIcmsST(): number;
    getAliquotaIcmsProprio(): number;
}

export interface IIcms202 {
    calculaBaseIcmsProprio(): number;
    calculaValorIcmsProprio(): number;
    calculaBaseIcmsST(): number;
    calculaValorIcmsST(): number;
    getAliquotaIcmsST(): number;
    getAliquotaIcmsProprio(): number;
}

export interface IIcms203 extends IIcms202 {}

export interface IIcms900 {
    calculaBaseIcmsProprio(): number;
    calculaBaseReduzidaIcmsProprio(): number;
    calculaValorIcmsProprio(): number;
    calculaValorCreditoSN(): number;
    calculaValorIcmsProprioBaseReduzida(): number;
    calculaBaseICMSST(): number;
    calculaBaseReduzidaICMSST(): number;
    calculaValorIcmsST(): number;
    calculaValorIcmsSTBaseReduzida(): number;
    getAliquotaIcmsProprio(): number;
    getAliquotaIcmsST(): number;
}
