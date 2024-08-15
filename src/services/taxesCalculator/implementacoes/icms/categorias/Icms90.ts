import Utils from "../../../utils/index";

import { IIcms90 } from "../../../interfaces/icms";
import { BaseIcmsST } from "../../../implementacoes/icms/components/BaseIcmsST";
import { BaseIcmsProprio } from "../../../implementacoes/icms/components/BaseIcmsProprio";
import { BaseReduzidaIcmsST } from "../../../implementacoes/icms/components/BaseReduzidaIcmsST";
import { ValorIcmsProprio } from "../../../implementacoes/icms/components/ValorIcmsProprio";
import { ValorIcmsST } from "../../../implementacoes/icms/components/ValorIcmsST";
import { BaseReduzidaIcmsProprio } from "../../../implementacoes/icms/components/BaseReduzidaIcmsProprio";

import { Icms00 } from "./Icms00";
import { Icms10 } from "./Icms10";

/**
 * 90 - Outras
 */
export class Icms90 implements IIcms90 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorIpi: number;
    private valorDesconto: number;
    private aliquotaIcmsProprio: number;
    private percentualReducao: number;
    private aliquotaIcmsST: number;
    private mva: number;
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
        valorIpi = 0,
        percentualReducao = 0,
        percentualReducaoST = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorIpi = valorIpi;
        this.valorDesconto = valorDesconto;
        this.aliquotaIcmsProprio = aliquotaIcmsProprio;
        this.percentualReducao = percentualReducao;
        this.aliquotaIcmsST = aliquotaIcmsST;
        this.mva = mva;
        this.percentualReducaoST = percentualReducaoST;
    }

    getAliquotaIcmsProprio(): number {
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

    calculaValorIcmsProprioDesonerado(): number {
        const icms00 = new Icms00(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorIpi,
            this.valorDesconto,
            this.aliquotaIcmsProprio,
        );

        const valorIcmsNormal: number = icms00.calculaValorIcmsProprio();
        const valorIcmsDesonerado: number = valorIcmsNormal - this.calculaValorIcmsProprioBaseReduzida();

        return Utils.roundToNearest(valorIcmsDesonerado, 2);
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

    calculaValorIcmsSTDesonerado(): number {
        const icms10 = new Icms10(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorIpi,
            this.valorDesconto,
            this.aliquotaIcmsProprio,
            this.aliquotaIcmsST,
            this.mva,
        );

        const valorICMSSTNormal: number = icms10.calculaValorIcmsST();
        const valorICMSSTDesonerado: number = valorICMSSTNormal - this.calculaValorIcmsSTBaseReduzida();

        return Utils.roundToNearest(valorICMSSTDesonerado, 2);
    }
}
