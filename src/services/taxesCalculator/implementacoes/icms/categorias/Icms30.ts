import { IIcms30 } from "../../../interfaces/icms";

import { BaseIcmsST } from "../components/BaseIcmsST";
import { BaseIcmsProprio } from "../components/BaseIcmsProprio";
import { BaseReduzidaIcmsST } from "../components/BaseReduzidaIcmsST";

import { ValorIcmsST } from "../components/ValorIcmsST";
import { ValorIcmsProprio } from "../components/ValorIcmsProprio";

/**
 * 30 - Isenta ou não tributada e com cobrança do ICMS por substituição tributária
 */
export class Icms30 implements IIcms30 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorIpi: number;
    private valorDesconto: number;
    private aliquotaIcmsProprio: number;
    private aliquotaIcmsST: number;
    private mva: number;
    private percentualReducaoST: number;
    private bcIcmsProprio: BaseIcmsProprio;
    private bcIcmsST: BaseIcmsST;
    private bcReduzidaIcmsST: BaseReduzidaIcmsST;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorIpi: number,
        valorDesconto: number,
        aliquotaIcmsProprio: number,
        aliquotaIcmsST: number,
        mva: number,
        percentualReducaoST = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorIpi = valorIpi;
        this.valorDesconto = valorDesconto;
        this.aliquotaIcmsProprio = aliquotaIcmsProprio;
        this.aliquotaIcmsST = aliquotaIcmsST;
        this.mva = mva;
        this.percentualReducaoST = percentualReducaoST;

        this.bcIcmsProprio = new BaseIcmsProprio(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorDesconto,
        );
    }

    getAliquotaIcmsProprio(): number {
        return this.aliquotaIcmsProprio;
    }

    getAliquotaIcmsST(): number {
        return this.aliquotaIcmsST;
    }

    calculaBaseIcmsProprio(): number {
        return this.bcIcmsProprio.calculaBaseIcmsProprio();
    }

    calculaValorIcmsProprio(): number {
        const valorIcmsProprio = new ValorIcmsProprio(
            this.calculaBaseIcmsProprio(),
            this.aliquotaIcmsProprio,
        ).calculaValorIcmsProprio();
        return valorIcmsProprio;
    }

    calculaValorIcmsDesonerado(): number {
        return this.calculaValorIcmsProprio();
    }

    calculaBaseIcmsST(): number {
        if (this.percentualReducaoST === 0) {
            this.bcIcmsST = new BaseIcmsST(this.calculaBaseIcmsProprio(), this.mva, this.valorIpi);

            return this.bcIcmsST.calculaBaseIcmsST();
        } else {
            this.bcReduzidaIcmsST = new BaseReduzidaIcmsST(
                this.calculaBaseIcmsProprio(),
                this.mva,
                this.percentualReducaoST,
                this.valorIpi,
            );

            return this.bcReduzidaIcmsST.calculaBaseReduzidaIcmsST();
        }
    }

    calculaValorIcmsST(): number {
        return new ValorIcmsST(
            this.calculaBaseIcmsST(),
            this.aliquotaIcmsST,
            this.calculaValorIcmsProprio(),
        ).calculaValorIcmsST();
    }
}
