import { icmsType, taxCofinsType, taxIpiType, taxPisType } from "./taxInterface"

export interface addEditProductDataSend {
    principal: addEditProductDataPrincipal,
    icms: icmsType,
    ipi: taxIpiType,
    cofins: taxCofinsType,
    pis: taxPisType
}

type addEditProductDataPrincipal = {
    id: number | null
    userId: number
    codRef: number | null
    name: string
    exTipi: string | null
    brand: string | null
    value: number 
    quantity: number 
    active: boolean
    cost: number | null
    profitMargin: number | null
    barCode: string | null
    ncmCode: string | null
    cfopId: number | null
    unitMeasurement: string
    itemTypeId: number | null
    imageId: number | null
    urlImage: string | null
}

