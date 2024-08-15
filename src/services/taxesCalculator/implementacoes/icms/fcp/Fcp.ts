import Utils from "../../../utils/index";
import { IFcp } from "../../../interfaces/icms";

export class Fcp implements IFcp {
    private baseCalculo: number;
    private aliquotaFCP: number;

    constructor(baseCalculo: number, aliquotaFCP: number) {
        this.baseCalculo = baseCalculo;
        this.aliquotaFCP = aliquotaFCP;
    }

    calculaValorFCP(): number {
        return Utils.roundToNearest((this.aliquotaFCP / 100) * this.baseCalculo, 2);
    }
}
