import { Ambiente, Crt, finalidadeNFe, fiscalModels, fiscalStatusNf, FormaPagamento, IndFinal, IndIEDest, IndIntermediador, OrigemMercadoria, PaymentType, TipoEmissao, TipoEntrega, TipoFrete, tipoSaida } from '../../interfaces/enums/fiscalNotaEnums';
import { CreateFiscalNoteInterface, NFeResponse } from '../../interfaces/fiscalNoteInterface';
import { useFiscalApi } from '../../services/api/fiscalApi';
import prisma from '../../services/prisma/index';
import { Request, Response } from 'express'
import validateFields from '../../utils/validateFields';
import { onlyNumbers, onlyNumbersStr } from '../../utils/utils';
import { useDanfeGeneratorApi } from '../../services/api/danfeGenerateApi';
import { FiscalNotes } from '@prisma/client';

export const createSellFiscalNote = async (request: Request, response: Response) => {
    try {
        const { sellId, userId } = request.body;
        validateFields(['sellId', 'userId'], request.body)

        const existsFiscalNote = await prisma.fiscalNotes.findFirst({ where: { sellId: sellId } })

        if (existsFiscalNote) {
            const user = await prisma.user.findFirst({ where: { id: userId } })
            const profile = user.key + '_' + onlyNumbersStr(user.cnpj)
            await generateDanfeAndRespond({ NFe: existsFiscalNote.keyNF, profile, xml: existsFiscalNote.xml }, response)
            return
        }

        const { emiteNfe } = useFiscalApi()
        const sellData = await getSellData(sellId, userId)

        if (!sellData) throw new Error("Não foi encontrado venda com o id informado!")
        if (!sellData[0].client?.id) throw new Error("Para emissão de NFe é obrigatório informar o cliente!")
        if (sellData[0].deleted ?? false) throw new Error("Essa venda já foi excluída")

        function calcBC(valueProducts: number, redBCICMS: number, finalCostumer: Boolean) {
            return valueProducts - (valueProducts * redBCICMS / 100)
            // verificar se precisa considerar o ipi no calculo
        }

        const ambiente = Ambiente.Homologacao

        const nfeData: CreateFiscalNoteInterface = {

            ambiente: ambiente,
            cMunFG: sellData[0].store.addressRelation.city.ibge,
            cUF: sellData[0].store.addressRelation.city.state.uf,
            finalidadeNFe: finalidadeNFe.Normal,
            indFinal: (sellData[0].client.finalCostumer ?? true) ? IndFinal.ConsumidorFinal : IndFinal.NaoConsumidorFinal,
            //indIntermediador: IndIntermediador.OperacaoSemIntermediador,
            indPag: sellData[0].paymentsells[0].payment.paymentCondition.codSefaz === FormaPagamento.Outras ? undefined : sellData[0].paymentsells[0].payment.paymentCondition.codSefaz,
            natOp: "Venda de mercadoria(s)",
            tpEmis: TipoEmissao.Normal,
            tpNF: tipoSaida.Saida,
            serie: 1,
            nNF: sellData[0].store.lastNumberNF ?? 1,
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
                    NCM: String(onlyNumbers(item.product.ncmCode)),
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
                            vBC: calcBC(item.totalValue, item.product.taxIcms[0].taxIcmsNfe[0].taxRedBCICMS, sellData[0].client.finalCostumer), // Valor da BC ICMS
                            vICMS: calcBC(item.totalValue, item.product.taxIcms[0].taxIcmsNfe[0].taxRedBCICMS, sellData[0].client.finalCostumer) * (item.product.taxIcms[0].taxIcmsNfe[0].taxAliquotIcms / 100), // Valor do ICMS
                            pFCP: item.product.taxIcms[0].fcpAliquot,
                            vFCP: calcBC(item.totalValue, item.product.taxIcms[0].taxIcmsNfe[0].taxRedBCICMS, sellData[0].client.finalCostumer) * (item.product.taxIcms[0].fcpAliquot / 100),
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
                        ...(item.product.taxIpi[0].taxCstIpiExitId &&
                        {
                            IPI: {
                                CST: String(item.product.taxIpi[0].taxCstIpiExitId), // Código de Situação Tributária do IPI
                                cEnq: item.product.taxIpi[0].taxStampIpi, // Código de Enquadramento Legal do IPI
                                clEnq: item.product.taxIpi[0].taxClassificationClassIpi, // Classe de Enquadramento do IPI
                                CNPJProd: item.product.taxIpi[0].taxCnpjProd, // CNPJ do Produtor, obrigatório nos casos de exportação direta ou indireta
                                cSelo: item.product.taxIpi[0].taxStampIpi, // Código do Selo de Controle do IPI
                                qSelo: item.product.taxIpi[0].taxQtdStampControlIpi, // Quantidade de Selos de Controle do IPI   
                                vBC: item.totalValue, // Valor da Base de Cálculo do IPI
                                pIPI: item.product.taxIpi[0].taxAliquotIpi, // Alíquota do IPI
                                vIPI: item.totalValue * (item.product.taxIpi[0].taxAliquotIpi / 100) // Valor do IPI
                                //qUnid: item.product.taxIpi[0].taxQtdUnidIpi, // Quantidade total na unidade padrão, só preenche se for valor fixo e nao percentual
                                //vUnid: item.product.taxIpi[0].taxValorUnidIpi // Valor por Unidade do IPI, só preenche se for valor fixo e nao percentual
                            }
                        }),
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
                        // COFINSST: {
                        //     indSomaCOFINSST: "",
                        //     pCOFINS: 0,
                        //     qBCProd: 0,
                        //     vAliqProd: 0,
                        //     vBC: 0,
                        //     vCOFINS: 0
                        // },
                        // PISST: {
                        //     indSomaPISST: "", // Indicador de soma do PISST
                        //     vAliqProd: 0, // Alíquota em valor
                        //     pPis: 0, // Percentual do PISST (se aplicável, caso contrário, 0)
                        //     qBCProd: 0, // Quantidade vendida (se aplicável, caso contrário, 0)
                        //     vBc: 0, // Valor da base de cálculo (se aplicável, caso contrário, 0)r
                        //     vPIS: 0 // Valor do PISST (se aplicável, caso contrário, 0)
                        // },
                        // II: { // Imposto de Importacao
                        //     vBc: 0,
                        //     vDespAdu: 0,
                        //     vII: 0,
                        //     vIOF: 0
                        // },
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
            ...(sellData[0].deliveries.length > 0 && {
                entrega: {
                    tipo: TipoEntrega.Entrega,
                    bairro: sellData[0].deliveries[0].address.addressNeighborhood,
                    CEP: onlyNumbers(sellData[0].deliveries[0].address.addressCep),
                    logradouro: sellData[0].deliveries[0].address.addressStreet,
                    nomeMunicipio: sellData[0].deliveries[0].address.city.name,
                    numero: sellData[0].deliveries[0].address.addressNumber,
                    complemento: sellData[0].deliveries[0].address.addressComplement,
                    UF: sellData[0].deliveries[0].address.city.state.uf,
                    codMunicipio: sellData[0].deliveries[0].address.city.ibge,
                    CNPJCPF: sellData[0].client.cpf
                }
            }),
            pagamento: sellData[0].paymentsells.map(itemPay => {
                return {
                    forma: itemPay.payment.codSefaz,
                    condicao: itemPay.payment.paymentCondition.codSefaz === FormaPagamento.Outras ? undefined : itemPay.payment.paymentCondition.codSefaz,
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
                infComplementar: "Nota fiscal de venda de mercadoria emitida nos termos da lei",
                //obsComplementar: [{ campo: "", texto: "" }],
                //obsFisco: [{ campo: "", texto: "" }]
            },
            total: {
                ICMS: {
                    vNF: sellData[0].sellValue,
                    vBC: 0,
                    vBCST: 0,
                    vCOFINS: 0,
                    vDesc: 0,
                    vFCPST: 0,
                    vFCPSTRet: 0,
                    vFCPUFDest: 0,
                    vFrete: 0,
                    vICMS: 0,
                    vICMSUFDest: 0,
                    vICMSUFRemet: 0,
                    vII: 0,
                    vIPI: 0,
                    vOutro: 0,
                    vPIS: 0,
                    vProd: 0,
                    vSeg: 0,
                    vST: 0,
                    vTotTrib: 0
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
            produtos: nfeData.produtos.map(item => {
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
            ,
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
        const result: NFeResponse = await emiteNfe(totalizedNfe, userId)

        await prisma.fiscalNotes.create({
            data: {
                enviroment: Number(totalizedNfe.ambiente),
                keyNF: onlyNumbersStr(result.NFe),
                numberNF: totalizedNfe.nNF,
                protocol: result.Protocolo,
                totalAmount: totalizedNfe.total.ICMS.vNF,
                xml: result.xml,
                serieNFId: totalizedNfe.serie,
                sellId: sellData[0].id,
                modelNFId: fiscalModels.nfe55,
                statusNFId: fiscalStatusNf.emitida,
                stateId: sellData[0].store.addressRelation.city.stateId,
                storeId: userId
            }
        })

        await prisma.user.update({
            data: { lastNumberNF: totalizedNfe.nNF },
            where: { id: userId }
        })

        if (result.cStat !== '100') throw new Error('Status da emissão: ' + result.cMsg)

        await generateDanfeAndRespond({ NFe: result.NFe, profile: result.profile, xml: result.xml }, response)

    } catch (error) {
        return response.status(400).json({ erro: 'Ocorreu uma falha ao emitir nota fiscal! ' + (error as Error).message });
    }
}



interface GenerateDanfeParams {
    NFe: string;
    profile: string;
    xml: string;
}

export const generateDanfeAndRespond = async (
    params: GenerateDanfeParams,
    response: Response
): Promise<Response> => {
    try {
        const { generateDanfe } = useDanfeGeneratorApi();
        const danfe = await generateDanfe(params);

        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', `attachment; filename="${params.NFe}.pdf"`);

        return response.send(danfe.data);
    } catch (error) {
        return response.status(400).json({
            erro: 'A nota fiscal foi emitida, porém ocorreu uma falha ao gerar a DANFE! ' + (error as Error).message
        });
    }
};

const getSellData = async (sellId: number, userId: number) => {

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

    return sellData
}