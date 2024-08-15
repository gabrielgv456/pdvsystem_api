import Utils from "../../utils/index";

export class BaseCofins {
    private valorProduto: number;
    private valorFrete: number;
    private valorSeguro: number;
    private valorOutrasDespesas: number;
    private valorDesconto: number;
    private valorIcms: number;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorDesconto: number,
        valorIcms = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorDesconto = valorDesconto;
        this.valorIcms = valorIcms;
    }

    calcularBaseCofins(): number {
        let baseCofins: number =
            this.valorProduto + this.valorFrete + this.valorSeguro + this.valorOutrasDespesas - this.valorDesconto;

        baseCofins = baseCofins - this.valorIcms;

        return Utils.roundToNearest(baseCofins, 2);
    }
}
