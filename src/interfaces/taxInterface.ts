export type icmsType = {
    TaxIcms: TaxIcmsType,
    TaxIcmsNfe: TaxIcmsNfeType,
    TaxIcmsNfce: TaxIcmsNfceType,
    TaxIcmsNoPayer: TaxIcmsNoPayerType,
    TaxIcmsST: TaxIcmsSTType
}

type TaxIcmsType = {
    taxIcmsOriginId: number | null
    fcpAliquot: number | null
}

type TaxIcmsNfeType = {
    taxCstIcmsId: number | null
    taxModalityBCId: number | null
    taxReasonExemptionId: number | null
    taxCfopStateId: number | null
    taxCfopInterstateId: number | null
    taxRedBCICMS: number | null
    taxAliquotIcms: number | null
}

type TaxIcmsNfceType = {
    taxCstIcmsId: number | null
    taxCfopId: number | null
    taxCfopDevolutionId: number | null
    taxRedBCICMS: number | null
    taxAliquotIcms: number | null
}

type TaxIcmsNoPayerType = {
    taxCstIcmsId: number | null
    taxRedBCICMS: number | null
    taxAliquotIcms: number | null
}

type TaxIcmsSTType = {
    taxCstIcmsStId: number | null
    taxCfopStateIdSt: number | null
    taxCfopInterstateIdSt: number | null
    taxModalityBCIdSt: number | null
    taxRedBCICMSSt: number | null
    taxAliquotIcmsInner: number | null
    taxRedBCICMSInner: number | null
    taxMvaPauta: number | null
}

export type taxIpiType = {
    taxCstIpiExitId: number | null
    taxCstIpiEntranceId: number | null
    taxAliquotIpi: number | null
    taxClassificationClassIpi: string | null
    taxStampIpi: string | null
    taxQtdStampControlIpi: number | null
    taxCodEnquadLegalIpi: string | null
    taxCnpjProd: string | null
}

export type taxCofinsType = {
    taxCstCofinsExitId: number | null
    taxCstCofinsEntranceId: number | null
    taxAliquotCofinsExit: number | null
    taxAliquotCofinsEntrance: number | null
}

export type taxPisType = {
    taxCstPisExitId: number | null
    taxCstPisEntranceId: number | null
    taxAliquotPisExit: number | null
    taxAliquotPisEntrance: number | null
}
