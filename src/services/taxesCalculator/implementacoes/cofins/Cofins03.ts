import { ICofins03 } from "../../interfaces/cofins";

import Utils from "../../utils/index";

export class Cofins03 implements ICofins03 {
    // A Base de COFINS será a Quantidade (qTrib) do produto na operação
    private baseCalculo: number;

    // Valor por Unidade Tributável
    private aliquotaPorUnidade: number;

    constructor(baseCalculo: number, aliquotaUnidade: number) {
        this.baseCalculo = baseCalculo;
        this.aliquotaPorUnidade = aliquotaUnidade;
    }

    calculaValorCofins(): number {
        return Utils.roundToNearest(this.aliquotaPorUnidade * this.baseCalculo, 2);
    }
}
