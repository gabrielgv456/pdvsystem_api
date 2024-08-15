import Utils from "../../../utils/index";
import { IIcms101 } from "../../../interfaces/icms";

import { BaseIcmsProprio } from "../components/BaseIcmsProprio";
import { BaseReduzidaIcmsProprio } from "../components/BaseReduzidaIcmsProprio";

export class Icms101 implements IIcms101 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorDesconto: number;
    private percentualCreditoSN: number;
    private percentualReducao: number;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorDesconto: number,
        percentualCreditoSN: number,
        percentualReducao = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorDesconto = valorDesconto;
        this.percentualCreditoSN = percentualCreditoSN;
        this.percentualReducao = percentualReducao;
    }

    calculaBaseIcmsProprio(): number {
        if (this.percentualReducao === 0) {
            const baseIcmsProprio = new BaseIcmsProprio(
                this.valorProduto,
                this.valorFrete,
                this.valorSeguro,
                this.valorOutrasDespesas,
                this.valorDesconto,
            );

            return baseIcmsProprio.calculaBaseIcmsProprio();
        } else {
            const baseReduzida = new BaseReduzidaIcmsProprio(
                this.valorProduto,
                this.valorFrete,
                this.valorSeguro,
                this.valorOutrasDespesas,
                this.valorDesconto,
                this.percentualReducao,
            );

            return baseReduzida.calculaBaseReduzidaIcmsProprio();
        }
    }

    calculaValorCreditoSN(): number {
        const valorCreditoSN = this.calculaBaseIcmsProprio() * (this.percentualCreditoSN / 100);

        return Utils.roundToNearest(valorCreditoSN, 2);
    }
}
