import Utils from "../../../utils/index";
import { IIcms900 } from "../../../interfaces/icms";

import { BaseIcmsProprio } from "../components/BaseIcmsProprio";
import { BaseReduzidaIcmsProprio } from "../components/BaseReduzidaIcmsProprio";

import { BaseIcmsST } from "../components/BaseIcmsST";
import { BaseReduzidaIcmsST } from "../components/BaseReduzidaIcmsST";

import { ValorIcmsST } from "../components/ValorIcmsST";
import { ValorIcmsProprio } from "../components/ValorIcmsProprio";

export class Icms900 implements IIcms900 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorDesconto: number;
    private aliquotaIcmsProprio: number;
    private aliquotaIcmsST: number;
    private mva: number;
    private percentualCreditoSN: number;
    private valorIpi: number;
    private percentualReducao: number;
    private percentualReducaoST: number;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorDesconto: number,
        aliquotaIcmsProprio: number,
        aliquotaIcmsST: number,
        mva: number,
        percentualCreditoSN = 0,
        valorIpi = 0,
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
        this.valorIpi = valorIpi;
        this.percentualReducao = percentualReducao;
        this.percentualReducaoST = percentualReducaoST;
    }

    getAliquotaIcmsProprio() {
        return this.aliquotaIcmsProprio;
    }

    getAliquotaIcmsST(): number {
        return this.aliquotaIcmsST;
    }

    // ICMS Próprio calculations
    calculaBaseIcmsProprio(): number {
        const baseIcmsProprio = new BaseIcmsProprio(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorDesconto,
            this.valorIpi,
        );

        return baseIcmsProprio.calculaBaseIcmsProprio();
    }

    calculaBaseReduzidaIcmsProprio(): number {
        const baseReduzidaIcmsProprio = new BaseReduzidaIcmsProprio(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorDesconto,
            this.percentualReducao,
            this.valorIpi,
        );

        return baseReduzidaIcmsProprio.calculaBaseReduzidaIcmsProprio();
    }

    calculaValorIcmsProprio(): number {
        const valorIcmsProprio = new ValorIcmsProprio(
            this.calculaBaseIcmsProprio(),
            this.aliquotaIcmsProprio,
        ).calculaValorIcmsProprio();

        return Utils.roundToNearest(valorIcmsProprio, 2);
    }

    calculaValorIcmsProprioBaseReduzida(): number {
        const valorIcmsProprio = new ValorIcmsProprio(
            this.calculaBaseReduzidaIcmsProprio(),
            this.aliquotaIcmsProprio,
        ).calculaValorIcmsProprio();

        return Utils.roundToNearest(valorIcmsProprio, 2);
    }

    calculaValorCreditoSN(): number {
        let valorCreditoSN = 0;

        if (this.percentualReducao === 0) {
            valorCreditoSN = this.calculaBaseIcmsProprio() * (this.percentualCreditoSN / 100);
        } else {
            valorCreditoSN = this.calculaBaseReduzidaIcmsProprio() * (this.percentualCreditoSN / 100);
        }

        return Utils.roundToNearest(valorCreditoSN, 2);
    }

    // ICMS ST calculations
    calculaBaseICMSST(): number {
        const baseIcmsST = new BaseIcmsST(this.calculaBaseIcmsProprio(), this.mva, this.valorIpi);

        return baseIcmsST.calculaBaseIcmsST();
    }

    calculaBaseReduzidaICMSST(): number {
        const baseReduzidaIcmsST = new BaseReduzidaIcmsST(
            this.calculaBaseIcmsProprio(),
            this.mva,
            this.percentualReducaoST,
            this.valorIpi,
        );

        return baseReduzidaIcmsST.calculaBaseReduzidaIcmsST();
    }

    calculaValorIcmsST(): number {
        const valorICMSST = new ValorIcmsST(
            this.calculaBaseICMSST(),
            this.aliquotaIcmsST,
            this.calculaValorIcmsProprio(),
        ).calculaValorIcmsST();

        return Utils.roundToNearest(valorICMSST, 2);
    }

    calculaValorIcmsSTBaseReduzida(): number {
        const valorICMSSTBaseReduzida = new ValorIcmsST(
            this.calculaBaseReduzidaICMSST(),
            this.aliquotaIcmsST,
            this.calculaValorIcmsProprio(),
        ).calculaValorIcmsST();

        return Utils.roundToNearest(valorICMSSTBaseReduzida, 2);
    }
}
