import Utils from "../../../utils/index";
import { IIcms20 } from "../../../interfaces/icms";

import { BaseReduzidaIcmsProprio } from "../components/BaseReduzidaIcmsProprio";

import { Icms00 } from "./Icms00";

/**
 * 20 - Tributada com redução de base de cálculo
 */
export class Icms20 implements IIcms20 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorIpi: number;
    private valorDesconto: number;
    private aliquotaIcmsProprio: number;
    private percentualReducao: number;
    private baseReduzidaIcms: BaseReduzidaIcmsProprio;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorIpi: number,
        valorDesconto: number,
        aliquotaIcmsProprio: number,
        percentualReducao: number,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorIpi = valorIpi;
        this.valorDesconto = valorDesconto;
        this.aliquotaIcmsProprio = aliquotaIcmsProprio;
        this.percentualReducao = percentualReducao;

        this.baseReduzidaIcms = new BaseReduzidaIcmsProprio(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorDesconto,
            this.percentualReducao,
            this.valorIpi,
        );
    }

    getAliquotaIcmsProprio(): number {
        return this.aliquotaIcmsProprio;
    }

    calculaBaseReduzidaIcmsProprio(): number {
        return this.baseReduzidaIcms.calculaBaseReduzidaIcmsProprio();
    }

    calculaValorIcmsProprio(): number {
        const baseReduzidaIcms = this.calculaBaseReduzidaIcmsProprio();
        const valorIcms = baseReduzidaIcms * (this.aliquotaIcmsProprio / 100);

        return Utils.roundToNearest(valorIcms, 2);
    }

    calculaValorIcmsDesonerado(): number {
        const icms00 = new Icms00(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorIpi,
            this.valorDesconto,
            this.aliquotaIcmsProprio,
        );

        const valorIcmsNormal = icms00.calculaValorIcmsProprio();
        const valorIcmsDesonerado = valorIcmsNormal - this.calculaValorIcmsProprio();

        return Utils.roundToNearest(valorIcmsDesonerado, 2);
    }
}
