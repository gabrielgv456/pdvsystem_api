import Utils from "../../../utils/index";
import { IIcms51 } from "../../../interfaces/icms";

import { BaseIcmsProprio } from "../components/BaseIcmsProprio";
import { BaseReduzidaIcmsProprio } from "../components/BaseReduzidaIcmsProprio";

import { ValorIcmsProprio } from "../components/ValorIcmsProprio";

/**
 * 51 - Diferimento
 */
export class Icms51 implements IIcms51 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorIpi: number;
    private valorDesconto: number;
    private aliquotaIcmsProprio: number;
    private percentualReducao: number;
    private percentualDiferimento: number;
    private bcIcmsProprio: BaseIcmsProprio;
    private bcReduzidaIcmsProprio: BaseReduzidaIcmsProprio;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorIpi: number,
        valorDesconto: number,
        aliquotaIcmsProprio: number,
        percentualReducao: number,
        percentualDiferimento: number,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorIpi = valorIpi;
        this.valorDesconto = valorDesconto;
        this.aliquotaIcmsProprio = aliquotaIcmsProprio;
        this.percentualReducao = percentualReducao;
        this.percentualDiferimento = percentualDiferimento;
    }

    getAliquotaIcmsProprio(): number {
        return this.aliquotaIcmsProprio;
    }

    calculaBaseIcmsProprio(): number {
        if (this.percentualReducao === 0) {
            this.bcIcmsProprio = new BaseIcmsProprio(
                this.valorProduto,
                this.valorFrete,
                this.valorSeguro,
                this.valorOutrasDespesas,
                this.valorDesconto,
                this.valorIpi,
            );

            return this.bcIcmsProprio.calculaBaseIcmsProprio();
        } else {
            this.bcReduzidaIcmsProprio = new BaseReduzidaIcmsProprio(
                this.valorProduto,
                this.valorFrete,
                this.valorSeguro,
                this.valorOutrasDespesas,
                this.valorDesconto,
                this.percentualReducao,
                this.valorIpi,
            );

            return this.bcReduzidaIcmsProprio.calculaBaseReduzidaIcmsProprio();
        }
    }

    calculaValorIcmsOperacao(): number {
        return new ValorIcmsProprio(this.calculaBaseIcmsProprio(), this.aliquotaIcmsProprio).calculaValorIcmsProprio();
    }

    calculaValorIcmsDiferido(): number {
        const valorIcmsOperacao = this.calculaValorIcmsOperacao();
        const valorIcmsDiferido = valorIcmsOperacao * (this.percentualDiferimento / 100);

        return Utils.roundToNearest(valorIcmsDiferido, 2);
    }

    calculaValorIcmsProprio(): number {
        const valorIcmsProprio = this.calculaValorIcmsOperacao() - this.calculaValorIcmsDiferido();

        return Utils.roundToNearest(valorIcmsProprio, 2);
    }
}
