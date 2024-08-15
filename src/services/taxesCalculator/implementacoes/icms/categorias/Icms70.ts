import Utils from "../../../utils/index";
import { IIcms70 } from "../../../interfaces/icms";

import { BaseIcmsST } from "../components/BaseIcmsST";
import { BaseReduzidaIcmsST } from "../components/BaseReduzidaIcmsST";
import { BaseReduzidaIcmsProprio } from "../components/BaseReduzidaIcmsProprio";

import { ValorIcmsST } from "../components/ValorIcmsST";
import { ValorIcmsProprio } from "../components/ValorIcmsProprio";

import { Icms00 } from "./Icms00";
import { Icms10 } from "./Icms10";

/**
 * 70 - Tributada com redução de base de cálculo e com cobrança do ICMS por substituição tributária
 */
export class Icms70 implements IIcms70 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorIpi: number;
    private valorDesconto: number;
    private aliquotaIcmsProprio: number;
    private aliquotaIcmsST: number;
    private mva: number;
    private percentualReducao: number;
    private percentualReducaoST: number;
    private bcReduzidaIcmsProprio: BaseReduzidaIcmsProprio;
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
        percentualReducao: number,
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
        this.percentualReducao = percentualReducao;
        this.percentualReducaoST = percentualReducaoST;
        this.bcReduzidaIcmsProprio = new BaseReduzidaIcmsProprio(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorDesconto,
            this.percentualReducao,
        );
    }

    getAliquotaIcmsProprio(): number {
        return this.aliquotaIcmsProprio;
    }

    getAliquotaIcmsST(): number {
        return this.aliquotaIcmsST;
    }

    calculaBaseIcmsProprio(): number {
        return this.bcReduzidaIcmsProprio.calculaBaseReduzidaIcmsProprio();
    }

    calculaValorIcmsProprio(): number {
        return new ValorIcmsProprio(this.calculaBaseIcmsProprio(), this.aliquotaIcmsProprio).calculaValorIcmsProprio();
    }

    calculaValorIcmsProprioDesonerado(): number {
        const icms00 = new Icms00(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            0,
            this.valorDesconto,
            this.aliquotaIcmsProprio,
        );

        const valorIcmsNormal = icms00.calculaValorIcmsProprio();
        const valorIcmsDesonerado = valorIcmsNormal - this.calculaValorIcmsProprio();

        return Utils.roundToNearest(valorIcmsDesonerado, 2);
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

        const valorICMSSTNormal = icms10.calculaValorIcmsST();
        const valorICMSSTDesonerado = valorICMSSTNormal - this.calculaValorIcmsST();

        return Utils.roundToNearest(valorICMSSTDesonerado, 2);
    }
}
