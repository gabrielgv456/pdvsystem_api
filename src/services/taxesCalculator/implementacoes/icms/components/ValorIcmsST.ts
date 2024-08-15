import Utils from "../../../utils/index";

export class ValorIcmsST {
    public baseCalculoST: number;
    public aliquotaIcmsST: number;
    public valorIcmsProprio: number;

    constructor(baseCalculoST: number, aliquotaIcmsST: number, valorIcmsProprio: number) {
        this.baseCalculoST = baseCalculoST;
        this.aliquotaIcmsST = aliquotaIcmsST;
        this.valorIcmsProprio = valorIcmsProprio;
    }

    calculaValorIcmsST(): number {
        const valorIcmsST = +(this.baseCalculoST * (this.aliquotaIcmsST / 100) - this.valorIcmsProprio);

        return Utils.roundToNearest(valorIcmsST, 2);
    }
}
