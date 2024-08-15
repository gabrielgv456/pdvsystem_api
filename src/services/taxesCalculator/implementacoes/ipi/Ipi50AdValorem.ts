import { IIpi50AdValorem } from "../../interfaces/ipi";
import Utils from "../../utils/index";

import { BaseIPI } from "./BaseIPI";

export class Ipi50AdValorem implements IIpi50AdValorem {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorDesconto: number;
    private aliquotaIPI: number;
    private baseCalculo: BaseIPI;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorDesconto: number,
        aliquotaIPI: number,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorDesconto = valorDesconto;
        this.aliquotaIPI = aliquotaIPI;

        this.baseCalculo = new BaseIPI(valorProduto, valorFrete, valorSeguro, valorOutrasDespesas, valorDesconto);
    }

    calculaBaseIPI(): number {
        return this.baseCalculo.calculaBaseIPI();
    }

    public calculaValorIPI(): number {
        const valorIpi = (this.calculaBaseIPI() * (this.aliquotaIPI / 100) * 100) / 100;
        return Utils.roundToNearest(valorIpi, 2);
    }
}
