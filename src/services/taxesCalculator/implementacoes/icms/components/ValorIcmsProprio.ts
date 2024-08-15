import Utils from "../../../utils/index";

export class ValorIcmsProprio {
    public baseCalculo: number;
    public aliquotaIcmsProprio: number;

    constructor(baseCalculo: number, aliquotaIcmsProprio: number) {
        this.baseCalculo = baseCalculo;
        this.aliquotaIcmsProprio = aliquotaIcmsProprio;
    }

    calculaValorIcmsProprio(): number {
        const valorIcmsProprio = +((this.aliquotaIcmsProprio / 100) * this.baseCalculo);

        return Utils.roundToNearest(valorIcmsProprio, 2);
    }
}
