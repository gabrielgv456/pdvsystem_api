import { Ambiente, Crt, finalidadeNFe, FormaPagamento, IndFinal, IndIEDest, IndIntermediador, OrigemMercadoria, TipoEmissao, TipoEntrega } from '../../interfaces/enums/fiscalNotaEnums';
import { CreateFiscalNoteInterface } from '../../interfaces/fiscalNoteInterface';
import prisma from '../../services/prisma/index';
import { Request, Response } from 'express'

export const createSellFiscalNote = async (request: Request, response: Response) => {
    try {
        const { sellId, userId } = request.body;

        const sellData = await prisma.sells.findMany({
            include: {
                client: true,
                deliveries: { include: { address: true } },
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
                paymentsells: true,
                store: true
            }, where: {
                AND: [
                    { id: sellId },
                    { storeId: userId }
                ]
            }
        });

        if (!sellData) throw new Error("Não foi encontrado venda com o id informado!")

        const nfeData: CreateFiscalNoteInterface = {
            profile: '',
            nfe: {
                ambiente: Ambiente.Normal,
                cMunFG: 1,
                cUF: "MG",
                finalidadeNFe: finalidadeNFe.Normal,
                indFinal: sellData[0].client.finalCostumer ? IndFinal.ConsumidorFinal : IndFinal.NaoConsumidorFinal,
                indIntermediador: IndIntermediador.OperacaoSemIntermediador,
                indPag: FormaPagamento.Nenhum,
                natOp: "",
                tpEmis: TipoEmissao.Saida,
                tpNF: "",
                nNF: 1,
                emitente: {
                    CNPJCPF: sellData[0].store.cnpj,
                    CRT: Crt.RegimeNormal,
                    nomeFantasia: sellData[0].store.fantasyName,
                    IE: sellData[0].store.ie,
                    razaoSocial: sellData[0].store.name,
                    endereco: {
                        bairro: sellData[0].store.adressNeighborhood,
                        CEP: sellData[0].store.adressCep,
                        logradouro: sellData[0].store.adressStreet,
                        nomeMunicipio: sellData[0].store.adressCity,
                        UF: sellData[0].store.adressState,
                        complemento: "",
                        numero: sellData[0].store.adressNumber,
                        fone: sellData[0].store.phone,
                        codMunicipio: 0
                    }
                },
                destinatario: {
                    CNPJCPF: sellData[0].client.cpf,
                    IE: sellData[0].client.ie,
                    nome: sellData[0].client.name,
                    indIEDest: IndIEDest.NaoContribuinte,
                    ISUF: "",
                    endereco: {
                        bairro: sellData[0].client.adressNeighborhood,
                        CEP: sellData[0].client.adressCep,
                        codMunicipio: 0,
                        complemento: sellData[0].client.adressComplement,
                        fone: sellData[0].client.phoneNumber,
                        logradouro: sellData[0].client.adressStreet,
                        nomeMunicipio: sellData[0].client.adressCity,
                        numero: sellData[0].client.adressNumber,
                        UF: sellData[0].client.adressState
                    }
                },
                produtos: sellData[0].itenssells.map((item) => {
                    return {
                        descricao: item.descriptionProduct,
                        codigo: String(item.idProduct),
                        codBarra: item.product.barCode,
                        codBarraTrib: item.product.barCode,
                        quantidade: item.quantity,
                        quantidadeTrib: item.quantity,
                        NCM: item.product.ncmCode,
                        unidade: item.product.unitMeasurement,
                        unidadeTrib: item.product.unitMeasurement,
                        precoVenda: item.valueProduct,
                        valorDesconto: item.discount,
                        valorUnitario: item.valueProduct,
                        valorUnitarioTrib: item.valueProduct,
                        infAdProd: "",
                        EAN: "",
                        EANTrib: "",
                        CEST: "",
                        CFOP: String(item.product.taxIcms[0].taxIcmsNfe[0].taxCfopStateId),
                        extIPI: item.product.exTipi,
                        valorSeguro: 0,
                        valorFrete: 0,
                        valorOutro: 0,
                        imposto: {
                            origemMercadoria: OrigemMercadoria.Nacional,
                            ICMS: {
                                CST: String(item.product.taxIcms[0].taxIcmsNfe[0].taxCstIcmsId),
                                modBC: String(item.product.taxIcms[0].taxIcmsNfe[0].taxModalityBCId),
                                CSOSN: "",
                                pCredSN: 0,
                                pFCPDif: 0,
                                pFCPST: 0,
                                pFCPSTRet: 0,
                                pICMS: 0,
                                pICMSEfet: 0,
                                pICMSST: 0,
                                pMVAST: 0,
                                pRedBC: 0,
                                pRedBCEfet: 0,
                                pRedBCST: 0,
                                pST: 0,
                                vBC: 0,
                                vBCEfet: 0,
                                vBCFCPST: 0,
                                vBCFCPSTRet: 0,
                                vBCST: 0,
                                vBCSTRet: 0,
                                vFCPDif: 0,
                                vFCPEfet: 0,
                                vFCPST: 0,
                                vFCPSTRet: 0,
                                vICMS: 0,
                                vICMSEfet: 0,
                                vICMSST: 0,
                                vICMSSTDeson: 0,
                                vICMSSTRet: 0,
                                vICMSSubstituto: 0
                            },
                            COFINS: {
                                CST: String(item.product.taxCofins[0].taxCstCofinsExit),
                                pCOFINS: 0,
                                qBCProd: 0,
                                vAliqProd: 0,
                                vBC: 0,
                                vCOFINS: 0
                            },
                            PIS: {
                                CST: String(item.product.taxPis[0].taxCstPisExit),
                                vAliqProd: item.product.taxPis[0].taxAliquotPisExit,
                                pPIS: 0,
                                qBCProd: 0,
                                vBC: 0,
                                vPIS: 0
                            },
                            II: {
                                vBc: 0,
                                vDespAdu: 0,
                                vII: 0,
                                vIOF: 0
                            },
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
                            }, PISST: {
                                indSomaPISST: "",
                                pPis: 0,
                                qBCProd: 0,
                                vAliqProd: 0,
                                vBc: 0,
                                vPIS: 0
                            },
                            vTotTrib: 0
                        }
                    }
                }),
                cobrancaDuplicata: [{ numero: "", valor: 0, vencimento: "" }],
                cobrancaFat: { numero: "", vDesc: 0, vLiq: 0, vOrig: 0 },
                compra: { cont: "", nEmp: "", ped: "" },
                exporta: { locEmbarq: "", UFembarq: "" },
                infIntermediador: { CNPJ: "", idCadIntTran: "" },
                transportadora: {
                    CNPJCPF: "", ender: "", IE: "", modFrete: "", mun: "", nome: "",
                    retTransp: {
                        CFOP: "",
                        munFG: 0,
                        pICMSRet: 0,
                        vBCRet: 0,
                        vICMSRet: 0,
                        vServ: 0
                    },
                    UF: "",
                    volume: {
                        esp: "",
                        marca: "",
                        nVol: "",
                        pesoB: 0,
                        pesoL: 0,
                        qVol: 0
                    }
                },
                entrega: {
                    bairro: sellData[0].deliveries[0].address.addressNeighborhood,
                    CEP: Number(sellData[0].deliveries[0].address.addressCep),
                    logradouro: sellData[0].deliveries[0].address.addressStreet,
                    nomeMunicipio: sellData[0].deliveries[0].address.addressCity,
                    numero: sellData[0].deliveries[0].address.addressNumber,
                    complemento: sellData[0].deliveries[0].address.addressComplement,
                    UF: sellData[0].deliveries[0].address.addressState,
                    codMunicipio: 0,
                    tipo: TipoEntrega.Entrega,
                    CNPJCPF: sellData[0].client.cpf
                },
                pagamento: [
                    {
                        bandeiraCartao: "",
                        CNPJ: "",
                        codAutorizacao: "",
                        condicao: "",
                        forma: "",
                        integrado: false,
                        tipoIntegracao: "",
                        valor: 0
                    }
                ],
                infAdicional: {
                    infAdicionalFisco: "",
                    infComplementar: "",
                    obsComplementar: [{ campo: "", texto: "" }],
                    obsFisco: [{ campo: "", texto: "" }]
                },
                total: {
                    ICMS: {
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
                        vNF: 0,
                        vOutro: 0,
                        vPIS: 0,
                        vProd: 0,
                        vSeg: 0,
                        vST: 0,
                        vTotTrib: 0
                    },
                    retTrib: {
                        vBCIRRF: 0,
                        vBCRetPrev: 0,
                        vIRRF: 0,
                        vRetCOFINS: 0,
                        vRetCSLL: 0,
                        vRetPIS: 0,
                        vRetPrev: 0
                    }
                }
            }
        }

        return response.status(200).json({ Success: true, erro: 'Nota Emitida com sucesso' });

    } catch (error) {
        return response.status(400).json({ Success: false, erro: 'Erro ao emitir nota fiscal! ' + (error as Error).message });
    }
}