import Utils from "../../../utils/index";

export class BaseReduzidaIcmsProprio {
    public valorProduto: number;
    public valorFrete: number;
    public valorSeguro: number;
    public valorOutrasDespesas: number;
    public valorIpi: number;
    public valorDesconto: number;
    public percentualReducao: number;

    constructor(
        valorProduto: number,
        valorFrete: number,
        valorSeguro: number,
        valorOutrasDespesas: number,
        valorDesconto: number,
        percentualReducao: number,
        valorIpi = 0,
    ) {
        this.valorProduto = valorProduto;
        this.valorFrete = valorFrete;
        this.valorSeguro = valorSeguro;
        this.valorOutrasDespesas = valorOutrasDespesas;
        this.valorIpi = valorIpi;
        this.valorDesconto = valorDesconto;
        this.percentualReducao = percentualReducao;
    }

    public calculaBaseReduzidaIcmsProprio(): number {
        const baseIcms: number =
            this.valorProduto + this.valorFrete + this.valorSeguro + this.valorOutrasDespesas - this.valorDesconto;

        const baseIcmsReduzida: number = baseIcms - baseIcms * (this.percentualReducao / 100) + this.valorIpi;

        return Utils.roundToNearest(baseIcmsReduzida, 2);
    }
}
