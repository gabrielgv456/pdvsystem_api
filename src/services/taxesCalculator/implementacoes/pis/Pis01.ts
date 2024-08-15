import { IPis01 } from "../../interfaces/pis";

import { BasePIS } from "./BasePIS";

import Utils from "../../utils/index";

export class Pis01 implements IPis01 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorDesconto: number;
    private aliquotaPIS: number;
    private valorIcms: number;
    private basePIS: BasePIS;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,

        valorOutrasDespesas: number,
        valorDesconto: number,
        aliquotaPIS: number,
        valorIcms = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorDesconto = valorDesconto;
        this.aliquotaPIS = aliquotaPIS;
        this.valorIcms = valorIcms;

        this.basePIS = new BasePIS(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorDesconto,
            this.valorIcms,
        );
    }

    calculaBasePis(): number {
        return Utils.roundToNearest(this.basePIS.calculaBasePIS(), 2);
    }

    calculaValorPis(): number {
        return Utils.roundToNearest(this.calculaBasePis() * (this.aliquotaPIS / 100), 2);
    }
}
