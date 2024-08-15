import { IFcpDif } from "../../../interfaces/icms";
import Utils from "../../../utils/index";

export class FcpDiferido implements IFcpDif {
    private valorFCP: number;
    private aliquotaDiferimentoFCP: number;

    constructor(valorFCP: number, aliquotaDiferimentoFCP: number) {
        this.valorFCP = valorFCP;
        this.aliquotaDiferimentoFCP = aliquotaDiferimentoFCP;
    }

    public calculaValorFCPDiferido(): number {
        const valorFCPDiferido = +(this.valorFCP * (this.aliquotaDiferimentoFCP / 100));
        return Utils.roundToNearest(valorFCPDiferido, 2);
    }
}
