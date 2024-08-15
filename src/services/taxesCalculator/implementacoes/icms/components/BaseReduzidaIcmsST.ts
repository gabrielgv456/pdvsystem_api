import Utils from "../../../utils/index";

export class BaseReduzidaIcmsST {
    public baseIcmsProprio: number;
    public mva: number;
    public valorIPI: number;
    public percentualReducaoST: number;

    constructor(baseIcmsProprio: number, mva: number, percentualReducaoST: number, valorIpi = 0) {
        this.baseIcmsProprio = baseIcmsProprio;
        this.mva = mva;
        this.valorIPI = valorIpi;
        this.percentualReducaoST = percentualReducaoST;
    }

    public calculaBaseReduzidaIcmsST(): number {
        // todo: check function with retaguarda
        let baseST: number = this.baseIcmsProprio * (1 + this.mva / 100);

        baseST -= baseST * (this.percentualReducaoST / 100);

        const baseSTReduzida: number = baseST + this.valorIPI;

        return Utils.roundToNearest(baseSTReduzida, 2);
    }
}
