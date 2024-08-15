import Utils from "../../../utils/index";

import { BaseIcmsST } from "../../../implementacoes/icms/components/BaseIcmsST";
import { BaseIcmsProprio } from "../../../implementacoes/icms/components/BaseIcmsProprio";
import { BaseReduzidaIcmsST } from "../../../implementacoes/icms/components/BaseReduzidaIcmsST";

import { ValorIcmsProprio } from "../../../implementacoes/icms/components/ValorIcmsProprio";
import { ValorIcmsST } from "../../../implementacoes/icms/components/ValorIcmsST";
import { IIcms10 } from "../../../interfaces/icms";

/**
 * 10 - Tributada e com cobrança do ICMS por substituição tributária
 */
export class Icms10 implements IIcms10 {
    private valorProduto = 0;
    private valorFrete = 0;
    private valorSeguro = 0;
    private valorOutrasDespesas = 0;
    private valorIpi = 0;
    private valorDesconto = 0;
    private aliquotaIcmsProprio = 0;
    private aliquotaIcmsST = 0;
    private mva = 0;
    private percentualReducaoST = 0;

    private baseIcmsST: BaseIcmsST;
    private baseIcmsProprio: BaseIcmsProprio;
    private baseReduzidaIcmsST: BaseReduzidaIcmsST;

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

        this.baseIcmsProprio = new BaseIcmsProprio(
            valorProduto,
            valorFrete,
            valorSeguro,
            valorOutrasDespesas,
            valorDesconto,
        );
    }

    // ICMS Próprio
    getAliquotaIcmsProprio(): number {
        return this.aliquotaIcmsProprio;
    }

    // ICMS ST
    getAliquotaIcmsST(): number {
        return this.aliquotaIcmsST;
    }

    calculaBaseIcmsProprio(): number {
        return this.baseIcmsProprio.calculaBaseIcmsProprio();
    }

    calculaValorIcmsProprio(): number {
        return new ValorIcmsProprio(this.calculaBaseIcmsProprio(), this.aliquotaIcmsProprio).calculaValorIcmsProprio();
    }

    calculaBaseIcmsST(): number {
        if (this.percentualReducaoST === 0) {
            return this.calculaBaseIcmsSTNormal();
        } else {
            this.baseReduzidaIcmsST = new BaseReduzidaIcmsST(
                this.calculaBaseIcmsProprio(),
                this.mva,
                this.percentualReducaoST,
                this.valorIpi,
            );

            return this.baseReduzidaIcmsST.calculaBaseReduzidaIcmsST();
        }
    }

    calculaBaseIcmsSTNormal(): number {
        this.baseIcmsST = new BaseIcmsST(this.calculaBaseIcmsProprio(), this.mva, this.valorIpi);

        return this.baseIcmsST.calculaBaseIcmsST();
    }

    calculaValorIcmsSTNormal(baseIcmsST = 0): number {
        return new ValorIcmsST(baseIcmsST, this.aliquotaIcmsST, this.calculaValorIcmsProprio()).calculaValorIcmsST();
    }

    calculaValorIcmsST(): number {
        return this.calculaValorIcmsSTNormal(this.calculaBaseIcmsST());
    }

    calculaValorIcmsSTDesonerado(): number {
        const valorICMSSTNormal: number = this.calculaValorIcmsSTNormal(this.calculaBaseIcmsSTNormal());
        const valorICMSSTDesonerado: number = valorICMSSTNormal - this.calculaValorIcmsST();

        return Utils.roundToNearest(valorICMSSTDesonerado, 2);
    }
}
