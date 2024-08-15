export interface IPis01 {
    calculaBasePis(): number;
    calculaValorPis(): number;
}

export interface IPis02 extends IPis01 {}

export interface IPis03 {
    calculaValorPis(): number;
}
