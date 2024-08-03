import { Ambiente, Crt, finalidadeNFe, FormaPagamento, IndFinal, IndIEDest, IndIntermediador, OrigemMercadoria, PaymentType, TipoEmissao, TipoEntrega, TipoFrete, tipoSaida } from '../../interfaces/enums/fiscalNotaEnums';
import { CreateFiscalNoteInterface } from '../../interfaces/fiscalNoteInterface';
import { useFiscalApi } from '../../services/api/fiscalApi';
import prisma from '../../services/prisma/index';
import { Request, Response } from 'express'
import validateFields from '../../utils/validateFields';
import { onlyNumbers } from '../../utils/utils';

export const createSellFiscalNote = async (request: Request, response: Response) => {
    try {
        const { sellId, userId } = request.body;
        validateFields(['sellId', 'userId'], request.body)
        const { emiteNfe } = useFiscalApi()

        const sellData = await prisma.sells.findMany({
            include: {
                client: { include: { address: { include: { city: { include: { state: true } } } } } },
                deliveries: { include: { address: { include: { city: { include: { state: true } } } } } },
                itenssells: {
                    include: {
                        product: {
                            include: {
                                taxIcms: {
                                    include: {
                                        taxIcmsNfe: true,
                                        taxIcmsNfce: true,
                                        taxIcmsNoPayer: true,
                                        taxIcmsOrigin: true,
                                        taxIcmsSt: true
                                    }
                                }, taxCofins: {
                                    include: {
                                        taxCstCofinsEntrance: true,
                                        taxCstCofinsExit: true
                                    }
                                }, taxIpi: {
                                    include: {
                                        taxCstIpiEntrance: true,
                                        taxCstIpiExit: true
                                    }
                                },
                                taxPis: {
                                    include: {
                                        taxCstPisEntrance: true,
                                        taxCstPisExit: true
                                    }
                                }
                            }
                        }
                    }
                },
                paymentsells: { include: { payment: { include: { paymentCondition: true } } } },
                store: { include: { addressRelation: { include: { city: { include: { state: true } } } } } }
            }, where: {
                AND: [
                    { id: sellId },
                    { storeId: userId }
                ]
            }
        });

        if (!sellData) throw new Error("Não foi encontrado venda com o id informado!")
        if (!sellData[0].client?.id) throw new Error("Para emissão de NFe é obrigatório informar o cliente!")

        function calcBC(valueProducts: number, redBCICMS: number) {
            return valueProducts - (valueProducts * redBCICMS / 100)
        }

        const nfeData: CreateFiscalNoteInterface = {

            ambiente: Ambiente.Homologacao,
            cMunFG: sellData[0].store.addressRelation.city.ibge,
            cUF: sellData[0].store.addressRelation.city.state.ibge,
            finalidadeNFe: finalidadeNFe.Normal,
            indFinal: (sellData[0].client.finalCostumer ?? true) ? IndFinal.ConsumidorFinal : IndFinal.NaoConsumidorFinal,
            indIntermediador: IndIntermediador.OperacaoSemIntermediador,
            indPag: FormaPagamento.Nenhum,
            natOp: "Venda de mercadoria",
            tpEmis: TipoEmissao.Normal,
            tpNF: tipoSaida.Saida,
            nNF: 1,
            emitente: {
                CNPJCPF: sellData[0].store.cnpj,
                CRT: sellData[0].store.taxCrtId,
                nomeFantasia: sellData[0].store.fantasyName,
                IE: sellData[0].store.ie,
                razaoSocial: sellData[0].store.name,
                endereco: {
                    bairro: sellData[0].store.addressRelation.addressNeighborhood,
                    CEP: onlyNumbers(sellData[0].store.addressRelation.addressCep),
                    logradouro: sellData[0].store.addressRelation.addressStreet,
                    nomeMunicipio: sellData[0].store.addressRelation.city.name,
                    UF: sellData[0].store.addressRelation.city.state.uf,
                    complemento: sellData[0].store.addressRelation.addressComplement,
                    numero: sellData[0].store.addressRelation.addressNumber,
                    codMunicipio: sellData[0].store.addressRelation.city.ibge,
                    fone: sellData[0].store.phone,
                }
            },
            destinatario: {
                CNPJCPF: sellData[0].client.cpf,
                IE: sellData[0].client.ie,
                nome: sellData[0].client.name,
                indIEDest: sellData[0].client.taxPayerTypeId,
                ISUF: sellData[0].client.suframa,
                endereco: {
                    bairro: sellData[0].client.address.addressNeighborhood,
                    CEP: onlyNumbers(sellData[0].client.address.addressCep),
                    codMunicipio: sellData[0].client.address.city.ibge,
                    complemento: sellData[0].client.address.addressComplement,
                    logradouro: sellData[0].client.address.addressStreet,
                    nomeMunicipio: sellData[0].client.address.city.name,
                    numero: sellData[0].client.address.addressNumber,
                    UF: sellData[0].client.address.city.state.uf,
                    fone: sellData[0].client.phoneNumber
                }
            },
            produtos: sellData[0].itenssells.map((item) => {
                return {
                    descricao: item.descriptionProduct,
                    codigo: String(item.idProduct),
                    codBarra: item.product.barCode,
                    codBarraTrib: item.product.barCode,
                    EAN: item.product.barCode ?? 'SEM GTIN',
                    EANTrib: item.product.barCode ?? 'SEM GTIN',
                    quantidade: item.quantity,
                    quantidadeTrib: item.quantity,
                    NCM: item.product.ncmCode,
                    unidade: item.product.unitMeasurement,
                    unidadeTrib: item.product.unitMeasurement,
                    precoVenda: item.totalValue,
                    valorDesconto: item.discount,
                    valorUnitario: item.valueProduct,
                    valorUnitarioTrib: item.valueProduct,
                    infAdProd: "",
                    //CEST: "", // Código Especificador da Substituição Tributária
                    CFOP: sellData[0].client.address.city.stateId === sellData[0].store.addressRelation.city.stateId ?
                        String(item.product.taxIcms[0].taxIcmsNfe[0].taxCfopStateId) :
                        String(item.product.taxIcms[0].taxIcmsNfe[0].taxCfopInterstateId),
                    extIPI: item.product.exTipi, // Código Exceção da Tabela de IPI
                    //valorSeguro: 0,
                    //valorFrete: 0,
                    //valorOutro: 0,
                    imposto: {
                        origemMercadoria: OrigemMercadoria.Nacional,
                        ICMS: {
                            ...(sellData[0].store.taxCrtId === Crt.SimplesNacional ?
                                {
                                    CSOSN: (String(sellData[0].client.taxPayerTypeId) === IndIEDest.NaoContribuinte) ?
                                        String(item.product.taxIcms[0].taxIcmsNoPayer[0].taxCstIcmsId)
                                        :
                                        String(item.product.taxIcms[0].taxIcmsNfe[0].taxCstIcmsId)
                                } // Somente simples nacional - Código de Situação da Operação no Simples Nacional
                                :
                                {
                                    CST: (String(sellData[0].client.taxPayerTypeId) === IndIEDest.NaoContribuinte) ?
                                        String(item.product.taxIcms[0].taxIcmsNoPayer[0].taxCstIcmsId)
                                        :
                                        String(item.product.taxIcms[0].taxIcmsNfe[0].taxCstIcmsId)
                                }
                            ), // Código de Situação Tibutaria
                            modBC: String(item.product.taxIcms[0].taxIcmsNfe[0].taxModalityBCId),
                            pICMS: (String(sellData[0].client.taxPayerTypeId) === IndIEDest.NaoContribuinte) ?
                                item.product.taxIcms[0].taxIcmsNoPayer[0].taxAliquotIcms :
                                item.product.taxIcms[0].taxIcmsNfe[0].taxAliquotIcms, // Aliquota ICMS
                            pRedBC: (String(sellData[0].client.taxPayerTypeId) === IndIEDest.NaoContribuinte) ?
                                item.product.taxIcms[0].taxIcmsNoPayer[0].taxRedBCICMS :
                                item.product.taxIcms[0].taxIcmsNfe[0].taxRedBCICMS, // Percentual de Redução da BC ICMS
                            vBC: calcBC(item.totalValue, item.product.taxIcms[0].taxIcmsNfe[0].taxRedBCICMS), // Valor da BC ICMS
                            vICMS: calcBC(item.totalValue, item.product.taxIcms[0].taxIcmsNfe[0].taxRedBCICMS) * (item.product.taxIcms[0].taxIcmsNfe[0].taxAliquotIcms / 100), // Valor do ICMS
                            pFCP: item.product.taxIcms[0].fcpAliquot,
                            vFCP: calcBC(item.totalValue, item.product.taxIcms[0].taxIcmsNfe[0].taxRedBCICMS) * (item.product.taxIcms[0].fcpAliquot / 100),
                            motDesICMS: item.product.taxIcms[0].taxIcmsNfe[0].taxReasonExemptionId, // Motivo desoneração ICMS
                            pCredSN: undefined,         // Alíquota aplicável de cálculo do crédito (Simples Nacional)
                            pFCPDif: undefined,         // Percentual do Fundo de Combate à Pobreza devido na operação própria
                            pFCPST: undefined,          // Percentual do Fundo de Combate à Pobreza devido na substituição tributária
                            pFCPSTRet: undefined,       // Percentual do Fundo de Combate à Pobreza retido anteriormente na substituição tributária
                            vFCPDif: undefined,         // Valor do Fundo de Combate à Pobreza devido na operação própria
                            vFCPEfet: undefined,        // Valor efetivo do Fundo de Combate à Pobreza
                            vFCPST: undefined,          // Valor do Fundo de Combate à Pobreza devido na substituição tributária
                            vFCPSTRet: undefined,       // Valor do Fundo de Combate à Pobreza retido anteriormente na substituição tributária
                            pICMSEfet: undefined,       // Alíquota do ICMS efetivo
                            pICMSST: undefined,         // Alíquota do ICMS na substituição tributária
                            pMVAST: undefined,          // Percentual de Margem de Valor Agregado na substituição tributária
                            pRedBCEfet: undefined,      // Percentual de redução da base de cálculo efetiva
                            pRedBCST: undefined,        // Percentual de redução da base de cálculo na substituição tributária
                            pST: undefined,             // Alíquota do ICMS na substituição tributária (ST)
                            vBCEfet: undefined,         // Valor da base de cálculo efetiva
                            vBCFCPST: undefined,        // Valor da base de cálculo do Fundo de Combate à Pobreza na substituição tributária
                            vBCFCPSTRet: undefined,     // Valor da base de cálculo do Fundo de Combate à Pobreza retido anteriormente na substituição tributária
                            vBCST: undefined,           // Valor da base de cálculo do ICMS na substituição tributária
                            vBCSTRet: undefined,        // Valor da base de cálculo do ICMS retido anteriormente na substituição tributária
                            vICMSEfet: undefined,       // Valor do ICMS efetivo
                            vICMSST: undefined,         // Valor do ICMS na substituição tributária
                            vICMSSTDeson: undefined,    // Valor do ICMS desonerado na substituição tributária
                            vICMSSTRet: undefined,      // Valor do ICMS retido anteriormente na substituição tributária
                            vICMSSubstituto: undefined  // Valor do ICMS do substituto tributário                                               
                        },
                        COFINS: {
                            CST: String(item.product.taxCofins?.[0].taxCstCofinsExit?.id).padStart(2, '0') ?? "",
                            pCOFINS: item.product.taxCofins[0].taxAliquotCofinsExit,
                            vBC: item.totalValue,
                            vCOFINS: item.totalValue * (item.product.taxCofins[0].taxAliquotCofinsExit / 100),
                            vAliqProd: undefined,
                            qBCProd: undefined,
                        },
                        PIS: {
                            CST: String(item.product.taxPis[0].taxCstPisExitId), // Código de Situação Tributária    
                            pPIS: item.product.taxPis[0].taxAliquotPisExit, // Percentual do PIS (se aplicável, caso contrário, 0)
                            vBC: item.totalValue, // Valor da base de cálculo (se aplicável, caso contrário, 0)
                            vPIS: item.totalValue * (item.product.taxPis[0].taxAliquotPisExit / 100), // Valor do PIS (se aplicável, caso contrário, 0)
                            vAliqProd: undefined, // Alíquota em valor
                            qBCProd: undefined // Quantidade vendida (se aplicável, caso contrário, 0)                      
                        },
                        // II: { // Imposto de Importacao
                        //     vBc: 0,
                        //     vDespAdu: 0,
                        //     vII: 0,
                        //     vIOF: 0
                        // },
                        ICMSUFDest: {
                            pFCPUFDest: 0,
                            pICMSInter: 0,
                            pICMSInterPart: 0,
                            pICMSUFDest: 0,
                            vBCUFDest: 0,
                            vFCPUFDest: 0,
                            vICMSUFDest: 0,
                            vICMSUFRemet: 0
                        },
                        COFINSST: {
                            indSomaCOFINSST: "",
                            pCOFINS: 0,
                            qBCProd: 0,
                            vAliqProd: 0,
                            vBC: 0,
                            vCOFINS: 0
                        },
                        PISST: {
                            indSomaPISST: "", // Indicador de soma do PISST
                            vAliqProd: 0, // Alíquota em valor
                            pPis: 0, // Percentual do PISST (se aplicável, caso contrário, 0)
                            qBCProd: 0, // Quantidade vendida (se aplicável, caso contrário, 0)
                            vBc: 0, // Valor da base de cálculo (se aplicável, caso contrário, 0)r
                            vPIS: 0 // Valor do PISST (se aplicável, caso contrário, 0)
                        },
                        vTotTrib: undefined
                    }
                }
            }),
            //cobrancaDuplicata: [{ numero: "", valor: 0, vencimento: "" }],
            //cobrancaFat: { numero: "", vDesc: 0, vLiq: 0, vOrig: 0 },
            //compra: { cont: "", nEmp: "", ped: "" },
            //exporta: { locEmbarq: "", UFembarq: "" },
            //infIntermediador: { CNPJ: "", idCadIntTran: "" },
            // transportadora: {
            //     CNPJCPF: "", ender: "", IE: "", modFrete: TipoFrete.mfContaDestinatario, mun: "", nome: "",
            //     retTransp: {
            //         CFOP: "",
            //         munFG: 0,
            //         pICMSRet: 0,
            //         vBCRet: 0,
            //         vICMSRet: 0,
            //         vServ: 0
            //     },
            //     UF: "",
            //     volume: {
            //         esp: "",
            //         marca: "",
            //         nVol: "",
            //         pesoB: 0,
            //         pesoL: 0,
            //         qVol: 0
            //     }
            // },
            entrega: {
                tipo: TipoEntrega.Retirada,
                bairro: sellData[0].deliveries[0].address.addressNeighborhood,
                CEP: onlyNumbers(sellData[0].deliveries[0].address.addressCep),
                logradouro: sellData[0].deliveries[0].address.addressStreet,
                nomeMunicipio: sellData[0].deliveries[0].address.addressCity,
                numero: sellData[0].deliveries[0].address.addressNumber,
                complemento: sellData[0].deliveries[0].address.addressComplement,
                UF: sellData[0].deliveries[0].address.addressState,
                codMunicipio: sellData[0].deliveries[0].address.city.ibge,
                CNPJCPF: sellData[0].client.cpf
            },
            pagamento: sellData[0].paymentsells.map(itemPay => {
                return {
                    forma: itemPay.payment.codSefaz,
                    condicao: itemPay.payment.paymentCondition.codSefaz,
                    valor: itemPay.value,
                    ...(((itemPay.payment.codSefaz === PaymentType.CartaoCredito) ||
                        (itemPay.payment.codSefaz === PaymentType.CartaoDebito)) && {
                        integrado: false,
                        tipoIntegracao: undefined,
                        bandeiraCartao: undefined,
                        CNPJ: undefined,
                        codAutorizacao: undefined
                    })
                }
            }
            ),
            infAdicional: {
                infAdicionalFisco: "Nota fiscal de venda de mercadoria emitida nos termos da lei",
                infComplementar: "InfCOmplementar",
                obsComplementar: [{ campo: "", texto: "" }],
                obsFisco: [{ campo: "", texto: "" }]
            },
            total: {
                ICMS: {
                    vNF: sellData[0].sellValue,
                    vBC: undefined,
                    vBCST: undefined,
                    vCOFINS: undefined,
                    vDesc: undefined,
                    vFCPST: undefined,
                    vFCPSTRet: undefined,
                    vFCPUFDest: undefined,
                    vFrete: undefined,
                    vICMS: undefined,
                    vICMSUFDest: undefined,
                    vICMSUFRemet: undefined,
                    vII: undefined,
                    vIPI: undefined,
                    vOutro: undefined,
                    vPIS: undefined,
                    vProd: undefined,
                    vSeg: undefined,
                    vST: undefined,
                    vTotTrib: undefined
                },
                // retTrib: {
                //     vBCIRRF: 0,
                //     vBCRetPrev: 0,
                //     vIRRF: 0,
                //     vRetCOFINS: 0,
                //     vRetCSLL: 0,
                //     vRetPIS: 0,
                //     vRetPrev: 0
                // }
            }
        }

        const totalizedNfe: CreateFiscalNoteInterface = {
            ...nfeData,
            produtos: {
                ...nfeData.produtos.map(item => {
                    return {
                        ...item, imposto: {
                            ...item.imposto,
                            vTotTrib:
                                item.imposto.ICMS.vICMS +
                                item.imposto.COFINS.vCOFINS +
                                item.imposto.PIS.vPIS
                        }
                    }
                })
            },
            total: {
                ICMS: {
                    ...nfeData.total.ICMS,
                    vBC: nfeData.produtos.reduce((acc, product) => { return acc + product.imposto.ICMS.vBC }, 0),
                    vCOFINS: nfeData.produtos.reduce((acc, product) => { return acc + product.imposto.COFINS.vCOFINS }, 0),
                    vDesc: nfeData.produtos.reduce((acc, product) => { return acc + product.valorDesconto }, 0),
                    vICMS: nfeData.produtos.reduce((acc, product) => { return acc + product.imposto.ICMS.vICMS }, 0),
                    vPIS: nfeData.produtos.reduce((acc, product) => { return acc + product.imposto.PIS.vPIS }, 0),
                    vProd: nfeData.produtos.reduce((acc, product) => { return acc + product.precoVenda }, 0)
                }
            }
        }

        console.log(totalizedNfe)
        const result = await emiteNfe(totalizedNfe)


        return response.status(200).json({ Success: true, erro: 'Nota Emitida com sucesso' });

    } catch (error) {
        return response.status(400).json({ Success: false, erro: 'Ocorreu uma falha ao emitir nota fiscal! ' + (error as Error).message });
    }
}