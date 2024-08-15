import { IPis03 } from "../../interfaces/pis";

import Utils from "../../utils/index";

export class Pis03 implements IPis03 {
    // A Base de PIS será a Quantidade (qTrib) do produto na operação
    private baseCalculo: number;

    // Valor por Unidade Tributável
    private aliquotaPorUnidade: number;

    constructor(baseCalculo: number, aliquotaUnidade: number) {
        this.baseCalculo = baseCalculo;
        this.aliquotaPorUnidade = aliquotaUnidade;
    }

    calculaValorPis(): number {
        return Utils.roundToNearest(this.aliquotaPorUnidade * this.baseCalculo, 2);
    }
}
