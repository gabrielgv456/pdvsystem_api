import Utils from "../../../utils/index";

export class BaseIcmsST {
    public baseIcmsProprio: number;
    public mva: number;
    public valorIPI: number;

    constructor(baseIcmsProprio: number, mva: number, valorIpi = 0) {
        this.baseIcmsProprio = baseIcmsProprio;
        this.mva = mva;
        this.valorIPI = valorIpi;
    }

    public calculaBaseIcmsST(): number {
        const baseIcmsST = (this.baseIcmsProprio + this.valorIPI) * (1 + this.mva / 100);
        return Utils.roundToNearest(baseIcmsST, 2);
    }
}
