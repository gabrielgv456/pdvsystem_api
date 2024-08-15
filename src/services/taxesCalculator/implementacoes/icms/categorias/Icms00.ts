import { IIcms00 } from "../../../interfaces/icms";

import { BaseIcmsProprio } from "../components/BaseIcmsProprio";
import { ValorIcmsProprio } from "../components/ValorIcmsProprio";

/**
 * 00 - Tributada integralmente
 */
export class Icms00 implements IIcms00 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorIpi: number;
    private valorDesconto: number;
    private aliquotaIcmsProprio: number;
    private baseIcmsProprio: BaseIcmsProprio;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorIpi: number,
        valorDesconto: number,
        aliquotaIcmsProprio: number,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorIpi = valorIpi;
        this.valorDesconto = valorDesconto;
        this.aliquotaIcmsProprio = aliquotaIcmsProprio;

        this.baseIcmsProprio = new BaseIcmsProprio(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorDesconto,
            this.valorIpi,
        );
    }

    getAliquotaIcmsProprio(): number {
        return this.aliquotaIcmsProprio;
    }

    calculaBaseIcmsProprio(): number {
        return this.baseIcmsProprio.calculaBaseIcmsProprio();
    }

    calculaValorIcmsProprio(): number {
        return new ValorIcmsProprio(this.calculaBaseIcmsProprio(), this.aliquotaIcmsProprio).calculaValorIcmsProprio();
    }
}
