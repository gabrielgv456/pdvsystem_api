import Utils from "../../../utils/index";
import { IIcms201 } from "../../../interfaces/icms";

import { BaseIcmsST } from "../components/BaseIcmsST";
import { BaseIcmsProprio } from "../components/BaseIcmsProprio";

import { BaseReduzidaIcmsST } from "../components/BaseReduzidaIcmsST";
import { BaseReduzidaIcmsProprio } from "../components/BaseReduzidaIcmsProprio";

import { ValorIcmsST } from "../components/ValorIcmsST";
import { ValorIcmsProprio } from "../components/ValorIcmsProprio";

export class Icms201 implements IIcms201 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorDesconto: number;
    private aliquotaIcmsProprio: number;
    private aliquotaIcmsST: number;
    private mva: number;
    private percentualCreditoSN: number;
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
        percentualCreditoSN: number,
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
        this.percentualCreditoSN = percentualCreditoSN;
        this.percentualReducao = percentualReducao;
        this.percentualReducaoST = percentualReducaoST;
    }

    getAliquotaIcmsST(): number {
        return this.aliquotaIcmsST;
    }

    getAliquotaIcmsProprio(): number {
        return this.aliquotaIcmsProprio;
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

    calculaValorCreditoSN(): number {
        const valorCreditoSN = this.calculaBaseIcmsProprio() * (this.percentualCreditoSN / 100);

        return Utils.roundToNearest(valorCreditoSN, 2);
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
