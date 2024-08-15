import { ICofins01 } from "../../interfaces/cofins";

import { BaseCofins } from "./BaseCofins";

import Utils from "../../utils/index";

export class Cofins01 implements ICofins01 {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorDesconto: number;
    private aliquotaCofins: number;
    private valorIcms: number;
    private baseCofins: BaseCofins;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,

        valorOutrasDespesas: number,
        valorDesconto: number,
        aliquotaCofins: number,
        valorIcms = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorDesconto = valorDesconto;
        this.aliquotaCofins = aliquotaCofins;
        this.valorIcms = valorIcms;

        this.baseCofins = new BaseCofins(
            this.valorProduto,
            this.valorFrete,
            this.valorSeguro,
            this.valorOutrasDespesas,
            this.valorDesconto,
            this.valorIcms,
        );
    }

    calculaBaseCofins(): number {
        return Utils.roundToNearest(this.baseCofins.calcularBaseCofins(), 2);
    }

    calculaValorCofins(): number {
        return Utils.roundToNearest(this.calculaBaseCofins() * (this.aliquotaCofins / 100), 2);
    }
}
