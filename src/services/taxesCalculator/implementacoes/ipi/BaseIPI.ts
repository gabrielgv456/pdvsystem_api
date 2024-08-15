import Utils from "../../utils/index";

export class BaseIPI {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorDesconto: number;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorDesconto = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorDesconto = valorDesconto;
    }

    calculaBaseIPI(): number {
        const baseIpi: number =
            this.valorProduto + this.valorFrete + this.valorSeguro + this.valorOutrasDespesas - this.valorDesconto;

        return Utils.roundToNearest(baseIpi, 2);
    }
}
