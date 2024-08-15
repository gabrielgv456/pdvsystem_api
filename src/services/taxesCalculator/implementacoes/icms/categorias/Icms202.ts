import { IIcms202 } from "../../../interfaces/icms";

import { BaseIcmsST } from "../../../implementacoes/icms/components/BaseIcmsST";
import { BaseIcmsProprio } from "../../../implementacoes/icms/components/BaseIcmsProprio";

import { BaseReduzidaIcmsST } from "../../../implementacoes/icms/components/BaseReduzidaIcmsST";
import { BaseReduzidaIcmsProprio } from "../../../implementacoes/icms/components/BaseReduzidaIcmsProprio";

import { ValorIcmsST } from "../../../implementacoes/icms/components/ValorIcmsST";
import { ValorIcmsProprio } from "../../../implementacoes/icms/components/ValorIcmsProprio";

export class Icms202 implements IIcms202 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorDesconto: number;
    private aliquotaIcmsProprio: number;
    private aliquotaIcmsST: number;
    private mva: number;
    private percentualReducao: number;
    private percentualReducaoST: number;
    private baseIcmsProprio: BaseIcmsProprio;
    private bcReduzidaIcmsProprio: BaseReduzidaIcmsProprio;
    private bcIcmsST: BaseIcmsST;
    private bcReduzidaIcmsST: BaseReduzidaIcmsST;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorDesconto: number,
        aliquotaIcmsProprio: number,
        aliquotaIcmsST: number,
        mva: number,
        percentualReducao = 0,
        percentualReducaoST = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorDesconto = valorDesconto;
        this.aliquotaIcmsProprio = aliquotaIcmsProprio;
        this.aliquotaIcmsST = aliquotaIcmsST;
        this.mva = mva;
        this.percentualReducao = percentualReducao;
        this.percentualReducaoST = percentualReducaoST;
    }

    calculaBaseIcmsProprio(): number {
        if (this.percentualReducao === 0) {
            this.baseIcmsProprio = new BaseIcmsProprio(
                this.valorProduto,
                this.valorFrete,
                this.valorSeguro,
                this.valorOutrasDespesas,
                this.valorDesconto,
            );

            return this.baseIcmsProprio.calculaBaseIcmsProprio();
        } else {
            this.bcReduzidaIcmsProprio = new BaseReduzidaIcmsProprio(
                this.valorProduto,
                this.valorFrete,
                this.valorSeguro,
                this.valorOutrasDespesas,
                this.valorDesconto,
                this.percentualReducao,
            );

            return this.bcReduzidaIcmsProprio.calculaBaseReduzidaIcmsProprio();
        }
    }

    // ICMS ST Calculations
    getAliquotaIcmsST(): number {
        return this.aliquotaIcmsST;
    }

    getAliquotaIcmsProprio(): number {
        return this.aliquotaIcmsProprio;
    }

    calculaBaseIcmsST(): number {
        if (this.percentualReducaoST === 0) {
            this.bcIcmsST = new BaseIcmsST(this.calculaBaseIcmsProprio(), this.mva);

            return this.bcIcmsST.calculaBaseIcmsST();
        } else {
            this.bcReduzidaIcmsST = new BaseReduzidaIcmsST(
                this.calculaBaseIcmsProprio(),
                this.mva,
                this.percentualReducaoST,
            );

            return this.bcReduzidaIcmsST.calculaBaseReduzidaIcmsST();
        }
    }

    calculaValorIcmsProprio(): number {
        const valorIcmsProprio = new ValorIcmsProprio(this.calculaBaseIcmsProprio(), this.aliquotaIcmsProprio);

        return valorIcmsProprio.calculaValorIcmsProprio();
    }

    calculaValorIcmsST(): number {
        const valorIcmsST = new ValorIcmsST(
            this.calculaBaseIcmsST(),
            this.aliquotaIcmsST,
            this.calculaValorIcmsProprio(),
        );

        return valorIcmsST.calculaValorIcmsST();
    }
}
