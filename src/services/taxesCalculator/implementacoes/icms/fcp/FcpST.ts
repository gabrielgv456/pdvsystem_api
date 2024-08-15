import { IFcpST } from "../../../interfaces/icms";
import Utils from "../../../utils/index";

export class FcpST implements IFcpST {
    private baseCalculoST: number;
    private aliquotaFCPST: number;

    constructor(baseCalculoST: number, aliquotaFCPST: number) {
        this.baseCalculoST = baseCalculoST;
        this.aliquotaFCPST = aliquotaFCPST;
    }

    public calculaValorFCPST(): number {
        const valorFCPST = +((this.aliquotaFCPST / 100) * this.baseCalculoST);
        return Utils.roundToNearest(valorFCPST, 2);
    }
}
