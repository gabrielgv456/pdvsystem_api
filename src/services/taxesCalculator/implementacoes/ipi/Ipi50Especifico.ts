import { IIpiEspecifico } from "../../interfaces/ipi";

import Utils from "../../utils/index";

export class Ipi50Especifico implements IIpiEspecifico {
    /**
     * A Base de IPI será a Quantidade (qTrib) do produto na operação
     */
    private baseCalculo: number;

    /**
     * Valor por Unidade Tributável
     */
    private aliquotaPorUnidade: number;

    constructor(baseCalculo: number, aliquotaUnidade: number) {
        this.baseCalculo = baseCalculo;
        this.aliquotaPorUnidade = aliquotaUnidade;
    }

    calculaValorIPI(): number {
        const valorIpi = (this.aliquotaPorUnidade * this.baseCalculo * 100) / 100;
        return Utils.roundToNearest(valorIpi, 2);
    }
}
