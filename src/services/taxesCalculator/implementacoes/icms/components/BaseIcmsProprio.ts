import Utils from "../../../utils/index";

export class BaseIcmsProprio {
    public valorProduto: number;
    public valorFrete: number;
    public valorSeguro: number;
    public valorOutrasDespesas: number;
    public valorIpi: number;
    public valorDesconto: number;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorDesconto: number,
        valorIpi = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorIpi = valorIpi;
        this.valorDesconto = valorDesconto;
    }

    public calculaBaseIcmsProprio(): number {
        const baseIcmsProprio: number =
            this.valorProduto +
            this.valorFrete +
            this.valorSeguro +
            this.valorOutrasDespesas +
            this.valorIpi -
            this.valorDesconto;

        return Utils.roundToNearest(baseIcmsProprio, 2);
    }
}
