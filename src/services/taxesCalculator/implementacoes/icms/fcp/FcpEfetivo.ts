import { IFcpEfet } from "../../../interfaces/icms";
import Utils from "../../../utils/index";

export class FcpEfetivo implements IFcpEfet {
    private valorFCP: number;
    private valorFCPDiferido: number;

    constructor(valorFCP: number, valorFCPDiferido: number) {
        this.valorFCP = valorFCP;
        this.valorFCPDiferido = valorFCPDiferido;
    }

    calculaValorFcpEfetivo(): number {
        return Utils.roundToNearest(this.valorFCP - this.valorFCPDiferido, 2);
    }
}
