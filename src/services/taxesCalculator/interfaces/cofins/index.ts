export interface ICofins01 {
    calculaBaseCofins(): number;
    calculaValorCofins(): number;
}

export interface ICofins02 extends ICofins01 {}

export interface ICofins03 {
    calculaValorCofins(): number;
}
