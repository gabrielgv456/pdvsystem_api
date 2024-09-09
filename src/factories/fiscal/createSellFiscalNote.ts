import { Ambiente, Crt, finalidadeNFe, fiscalEvent, fiscalModels, fiscalStatusNf, FormaPagamento, IndFinal, IndIEDest, IndIntermediador, IndPresencaComprador, OrigemMercadoria, PaymentType, TipoEmissao, TipoEntrega, TipoFrete, tipoSaida } from '../../interfaces/enums/fiscalNotaEnums';
import { CreateFiscalNoteInterface, NFeResponse } from '../../interfaces/fiscalNoteInterface';
import { useFiscalApi } from '../../services/api/fiscalApi';
import prisma from '../../services/prisma/index';
import { Request, Response } from 'express'
import validateFields from '../../utils/validateFields';
import { onlyNumbers, onlyNumbersStr } from '../../utils/utils';
import { useDanfeGeneratorApi } from '../../services/api/danfeGenerateApi';
import { BaseCofins, BaseIcmsProprio, BaseIPI, BasePIS, BaseReduzidaIcmsProprio, Cofins01, Cofins02, Cofins03, Fcp, FcpEfetivo, Icms00, Icms10, Icms101, Icms20, Icms30, Icms51, Icms70, Icms90, Icms900, Ipi50AdValorem, Ipi50Especifico, Pis01, Pis02, Pis03, ValorIcmsProprio } from '../../services/taxesCalculator';
import { ICofins01, ICofins03 } from '../../services/taxesCalculator/interfaces/cofins';
import Utils from '../../services/taxesCalculator/utils';
import { rootPath } from '../../../rootPath';
import path from 'path';
import fs from 'fs'

export const createSellFiscalNote = async (request: Request, response: Response) => {
    try {
        const { sellId, userId } = request.body;
        validateFields(['sellId', 'userId'], request.body)

        const existsFiscalNote = await prisma.fiscalNotes.findFirst({ where: { sellId: sellId, statusNFId: fiscalStatusNf.autorizada } })

        if (existsFiscalNote) {
            const user = await prisma.user.findFirst({ where: { id: userId }, include: { logo: true } })
            const profile = user.key + '_' + onlyNumbersStr(user.cnpj)
            const pathLogo = user.logo ? path.join(rootPath(), user.logo.path, user.logo.nameFile) : ''
            const logoBase64 = pathLogo ? fs.readFileSync(pathLogo).toString('base64') : null
            await generateDanfeAndRespond({
                NFe: existsFiscalNote.keyNF,
                profile, xml: existsFiscalNote.xml,
                model: (existsFiscalNote.modelNFId === 1 ? 'NFE' : 'NFCE'),
                logoBase64,
                positionYLogoNFe: user.positionYLogoNFe ?? 0,
                positionYEmitDataNFe: user.positionYEmitDataNFe ?? 0
            },
                response)
            return
        }

        enum modelEnum {
            'NFCE' = 'NFCE',
            'NFE' = 'NFE'
        }
        // TRUE = NFCE , FALSE = NFE  



        const { emiteNfe } = useFiscalApi()
        const sellData = await getSellData(sellId, userId)
        if (!sellData) throw new Error("Não foi encontrado venda com o id informado!")

        const model: modelEnum = ((sellData[0].client?.taxPayerTypeId ?? 9) === 9) ? modelEnum.NFCE : modelEnum.NFE;
        if (model === modelEnum.NFE && !sellData[0].client?.id) throw new Error("Para emissão de NFe é obrigatório informar o cliente!")
        if (sellData[0].deleted ?? false) throw new Error("Essa venda já foi excluída")


        const ambiente = Ambiente.Homologacao

        // Preenche dados principais e valores
        const nfeData: CreateFiscalNoteInterface = {

            certificadoSenha: sellData[0].store.passCert,
            codCSC: sellData[0].store.codCSC,
            ambiente: ambiente,
            cMunFG: sellData[0].store.addressRelation.city.ibge,
            cUF: sellData[0].store.addressRelation.city.state.uf,
            finalidadeNFe: finalidadeNFe.Normal,
            indFinal: (sellData[0].client?.finalCostumer ?? true) ? IndFinal.ConsumidorFinal : IndFinal.NaoConsumidorFinal,
            indPresenca: IndPresencaComprador.pcPresencial,
            //indIntermediador: IndIntermediador.OperacaoSemIntermediador,
            indPag: sellData[0].paymentsells[0].payment.paymentCondition.codSefaz === FormaPagamento.Outras ? undefined : sellData[0].paymentsells[0].payment.paymentCondition.codSefaz,
            natOp: "VENDA",
            tpEmis: TipoEmissao.Normal,
            tpNF: tipoSaida.Saida,
            serie: model === modelEnum.NFE ? 1 : 2,
            nNF: model === modelEnum.NFE ? (sellData[0].store.lastNumberNF + 1 ?? 1) : (sellData[0].store.lastNumberNFCE + 1 ?? 1),
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
            ...(sellData[0].client?.cpf && {
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
                }
            }),
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
                    NCM: item.product.ncmCode ? String(onlyNumbers(item.product.ncmCode)) : '',
                    unidade: item.product.unitMeasurement,
                    unidadeTrib: item.product.unitMeasurement,
                    valorTotalProdutos: item.totalValue + (item.discount ?? 0),
                    valorDesconto: item.discount ?? 0,
                    valorUnitarioComerc: item.valueProduct + (item.discount ?? 0),
                    valorUnitarioTrib: item.valueProduct + (item.discount ?? 0),
                    infAdProd: "",
                    CEST: "", // Código Especificador da Substituição Tributária
                    CFOP: model === modelEnum.NFE ? (
                        !sellData[0].client?.cpf ? String(item.product.taxIcms[0].taxIcmsNfe[0].taxCfopStateId) :
                            (sellData[0].client.address.city.stateId === sellData[0].store.addressRelation.city.stateId ?
                                String(item.product.taxIcms[0].taxIcmsNfe[0].taxCfopStateId ?? '') :
                                String(item.product.taxIcms[0].taxIcmsNfe[0].taxCfopInterstateId ?? ''))
                    ) : (
                        String(item.product.taxIcms[0].taxIcmsNfce[0].taxCfopId ?? '')
                    ),
                    extIPI: item.product.exTipi, // Código Exceção da Tabela de IPI
                    valorSeguro: 0,
                    valorFrete: 0,
                    valorOutro: 0,
                    imposto: {
                        origemMercadoria: item.product.taxIcms[0].taxIcmsOrigin?.codSefaz ?? OrigemMercadoria.Nacional,
                        ICMS: {
                            ...(sellData[0].store.taxCrtId === Crt.SimplesNacional ?
                                {
                                    CSOSN: (String(sellData[0].client?.taxPayerTypeId ?? 9) === IndIEDest.NaoContribuinte) ?
                                        (item.product.taxIcms[0].taxIcmsNoPayer[0].taxCstIcms?.codSefaz ?? null)
                                        :
                                        (model === modelEnum.NFE ?
                                            (item.product.taxIcms[0].taxIcmsNfe[0].taxCstIcms?.codSefaz ?? null) :
                                            (item.product.taxIcms[0].taxIcmsNfce[0].taxCstIcms?.codSefaz ?? null))
                                } // Somente simples nacional - Código de Situação da Operação no Simples Nacional
                                :
                                {
                                    CST: (String(sellData[0].client?.taxPayerTypeId ?? 9) === IndIEDest.NaoContribuinte) ?
                                        (item.product.taxIcms[0].taxIcmsNoPayer[0].taxCstIcms.codSefaz ?? null)
                                        :
                                        (model === modelEnum.NFE ?
                                            (item.product.taxIcms[0].taxIcmsNfe[0].taxCstIcms.codSefaz ?? null) :
                                            (item.product.taxIcms[0].taxIcmsNfce[0].taxCstIcms.codSefaz ?? null))
                                }
                            ), // Código de Situação Tibutaria
                            modBC: model === modelEnum.NFE ?
                                (item.product.taxIcms[0].taxIcmsNfe[0].taxModalityBC?.codSefaz ?? undefined) : undefined,
                            pICMS: ((String(sellData[0].client?.taxPayerTypeId ?? 9) === IndIEDest.NaoContribuinte) ?
                                item.product.taxIcms[0].taxIcmsNoPayer[0].taxAliquotIcms ?? 0 :
                                (model === modelEnum.NFE ?
                                    (item.product.taxIcms[0].taxIcmsNfe[0].taxAliquotIcms ?? 0) :
                                    (item.product.taxIcms[0].taxIcmsNfce[0].taxAliquotIcms ?? 0)
                                )), // Aliquota ICMS
                            pRedBC: ((String(sellData[0].client?.taxPayerTypeId ?? 9) === IndIEDest.NaoContribuinte) ?
                                item.product.taxIcms[0].taxIcmsNoPayer[0].taxRedBCICMS ?? 0 :
                                (model === modelEnum.NFE ?
                                    (item.product.taxIcms[0].taxIcmsNfe[0].taxRedBCICMS ?? 0) : // Percentual de Redução da BC ICMS
                                    (item.product.taxIcms[0].taxIcmsNfce[0].taxRedBCICMS ?? 0)))
                            ,
                            vBC: 0, // Valor da BC ICMS
                            vICMS: 0, // Valor do ICMS
                            pFCP: item.product.taxIcms[0].fcpAliquot ?? 0,
                            vFCP: 0,
                            motDesICMS: model === modelEnum.NFE ? item.product.taxIcms[0].taxIcmsNfe[0].taxReasonExemptionId : undefined, // Motivo desoneração ICMS
                            pCredSN: 0,         // Alíquota aplicável de cálculo do crédito (Simples Nacional)
                            pFCPST: 0,          // Percentual do Fundo de Combate à Pobreza devido na substituição tributária
                            pFCPSTRet: 0,       // Percentual do Fundo de Combate à Pobreza retido anteriormente na substituição tributária
                            vFCPST: 0,          // Valor do Fundo de Combate à Pobreza devido na substituição tributária
                            vFCPSTRet: 0,       // Valor do Fundo de Combate à Pobreza retido anteriormente na substituição tributária
                            pICMSEfet: 0,       // Alíquota do ICMS efetivo
                            pICMSST: 0,         // Alíquota do ICMS na substituição tributária
                            pMVAST: item.product.taxIcms[0].taxIcmsSt?.[0].taxMvaPauta ?? 0,          // Percentual de Margem de Valor Agregado na substituição tributária
                            pRedBCEfet: 0,      // Percentual de redução da base de cálculo efetiva
                            pRedBCST: 0,        // Percentual de redução da base de cálculo na substituição tributária
                            pST: 0,             // Alíquota do ICMS na substituição tributária (ST)
                            vBCEfet: 0,         // Valor da base de cálculo efetiva
                            vBCFCPST: 0,        // Valor da base de cálculo do Fundo de Combate à Pobreza na substituição tributária
                            vBCFCPSTRet: 0,     // Valor da base de cálculo do Fundo de Combate à Pobreza retido anteriormente na substituição tributária
                            vBCST: 0,           // Valor da base de cálculo do ICMS na substituição tributária
                            vBCSTRet: 0,        // Valor da base de cálculo do ICMS retido anteriormente na substituição tributária
                            vICMSEfet: 0,       // Valor do ICMS efetivo
                            vICMSST: 0,         // Valor do ICMS na substituição tributária
                            vICMSSTDeson: 0,    // Valor do ICMS desonerado na substituição tributária
                            vICMSSTRet: 0,      // Valor do ICMS retido anteriormente na substituição tributária
                            vICMSSubstituto: 0  // Valor do ICMS do substituto tributário                                               
                        },
                        COFINS: {
                            CST: item.product.taxCofins?.[0].taxCstCofinsExit?.codSefaz ?? null,
                            pCOFINS: item.product.taxCofins[0].taxAliquotCofinsExit ?? 0,
                            vBC: 0,//item.totalValue,
                            vCOFINS: 0,//item.totalValue * (item.product.taxCofins[0].taxAliquotCofinsExit / 100),
                            vAliqProd: 0,
                            qBCProd: 0,
                        },
                        PIS: {
                            CST: (item.product.taxPis[0].taxCstPisExit?.codSefaz ?? null), // Código de Situação Tributária    
                            pPIS: item.product.taxPis[0].taxAliquotPisExit ?? 0, // Percentual do PIS (se aplicável, caso contrário, 0)
                            vBC: 0, // Valor da base de cálculo (se aplicável, caso contrário, 0)
                            vPIS: 0, // Valor do PIS (se aplicável, caso contrário, 0)
                            vAliqProd: 0, // Alíquota em valor
                            qBCProd: 0 // Quantidade vendida (se aplicável, caso contrário, 0)                      
                        },
                        IPI: {
                            CST: (item.product.taxIpi[0].taxCstIpiExit?.codSefaz ?? null), // Código de Situação Tributária do IPI
                            cEnq: item.product.taxIpi[0].taxStampIpi, // Código de Enquadramento Legal do IPI
                            clEnq: item.product.taxIpi[0].taxClassificationClassIpi, // Classe de Enquadramento do IPI
                            CNPJProd: item.product.taxIpi[0].taxCnpjProd, // CNPJ do Produtor, obrigatório nos casos de exportação direta ou indireta
                            cSelo: item.product.taxIpi[0].taxStampIpi, // Código do Selo de Controle do IPI
                            qSelo: item.product.taxIpi[0].taxQtdStampControlIpi, // Quantidade de Selos de Controle do IPI   
                            vBC: 0, // Valor da Base de Cálculo do IPI
                            pIPI: item.product.taxIpi[0].taxAliquotIpi ?? 0, // Alíquota do IPI
                            vIPI: 0 // Valor do IPI
                            //qUnid: item.product.taxIpi[0].taxQtdUnidIpi, // Quantidade total na unidade padrão, só preenche se for valor fixo e nao percentual
                            //vUnid: item.product.taxIpi[0].taxValorUnidIpi // Valor por Unidade do IPI, só preenche se for valor fixo e nao percentual
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
                        vTotTrib: 0
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
                    CNPJCPF: sellData[0].client?.cpf ?? ''
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

        // Calcula impostos e tributações
        const NfeWithTaxes: CreateFiscalNoteInterface = {
            ...nfeData,
            produtos: nfeData.produtos.map(item => {

                //IPI
                let bcIPI = 0
                let valorIPI = 0
                if (item.imposto.IPI) {
                    switch (item.imposto.IPI.CST) {
                        case '50': // 50 - Saída Tributada
                            const Ipi50AdValor = new Ipi50AdValorem(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, item.imposto.IPI.pIPI)
                            bcIPI = Ipi50AdValor.calculaBaseIPI()
                            valorIPI = Ipi50AdValor.calculaValorIPI()
                            break;
                        case '99': // 99 - Outras Saídas
                            bcIPI = new BaseIPI(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto).calculaBaseIPI()
                            valorIPI = Utils.roundToNearest(bcIPI * (item.imposto.IPI.pIPI / 100))
                            break;
                        // Nas condições abaixo não há cobrança de tributo    
                        case '51': // 51 - Saída Tributável com Alíquota Zero   
                        case '52': // 52 - Saída Isenta
                        case '53': // 53 - Saída Não-Tributada 
                        case '54': // 54 - Saída Imune
                        case '55': // 55 - Saída com Suspensão
                        case null:
                        case '':
                            break;
                        default:
                            throw new Error(`CST IPI ${item.imposto.IPI.CST} não esperado!`)
                    }
                }

                //ICMS
                let bcICMS = 0
                let valueICMS = 0
                let valueFCP = 0

                if (item.imposto.ICMS) {

                    if (nfeData.emitente.CRT === Crt.RegimeNormal || (nfeData.emitente.CRT === Crt.SimplesExcessoReceita)) {

                        switch (item.imposto.ICMS.CST) {
                            case '00': // 00 - Tributada integralmente
                                const icms00 = new Icms00(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, valorIPI, item.valorDesconto, item.imposto.ICMS.pICMS)
                                bcICMS = icms00.calculaBaseIcmsProprio()
                                valueICMS = icms00.calculaValorIcmsProprio()
                                valueFCP = new Fcp(bcICMS, item.imposto.ICMS.pFCP).calculaValorFCP()
                                break;
                            case '10': // 10 - Tributada e com cobrança do ICMS por substituição tributária
                                // ajustar
                                const icms10 = new Icms10(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, valorIPI, item.valorDesconto, item.imposto.ICMS.pICMS, item.imposto.ICMS.pICMSST, item.imposto.ICMS.pMVAST, item.imposto.ICMS.pRedBCST)
                                bcICMS = icms10.calculaBaseIcmsProprio()
                                valueICMS = icms10.calculaValorIcmsProprio()
                                valueFCP = new Fcp(bcICMS, item.imposto.ICMS.pFCP).calculaValorFCP()
                                break;
                            case '20': // 20 - Com redução de base de cálculo
                                const icms20 = new Icms20(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, valorIPI, item.valorDesconto, item.imposto.ICMS.pICMS, item.imposto.ICMS.pRedBC)
                                bcICMS = icms20.calculaBaseReduzidaIcmsProprio()
                                valueICMS = icms20.calculaValorIcmsProprio()
                                valueFCP = new Fcp(bcICMS, item.imposto.ICMS.pFCP).calculaValorFCP()
                                break;
                            case '30': // Isenta ou não tributada e com cobrança do ICMS por substituição tributária
                                const icms30 = new Icms30(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, valorIPI, item.valorDesconto, item.imposto.ICMS.pICMS, item.imposto.ICMS.pICMSST, item.imposto.ICMS.pMVAST, item.imposto.ICMS.pRedBCST)
                                bcICMS = icms30.calculaBaseIcmsProprio()
                                valueICMS = icms30.calculaValorIcmsProprio()
                                valueFCP = new Fcp(bcICMS, item.imposto.ICMS.pFCP).calculaValorFCP()
                                break;
                            case '70': // 70 - Com redução de base de cálculo e cobrança do ICMS por substituição tributária
                                // ajustar
                                const icms70 = new Icms70(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, valorIPI, item.valorDesconto, item.imposto.ICMS.pICMS, item.imposto.ICMS.pICMSST, item.imposto.ICMS.pMVAST, item.imposto.ICMS.pRedBC, item.imposto.ICMS.pRedBCST)
                                bcICMS = icms70.calculaBaseIcmsProprio()
                                valueICMS = icms70.calculaValorIcmsProprio()
                                valueFCP = new Fcp(bcICMS, item.imposto.ICMS.pFCP).calculaValorFCP()
                                break;
                            case '90': // 90 - Outros (outras situações que não se enquadram nos códigos anteriores)    
                                const icms90 = new Icms90(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, item.imposto.ICMS.pICMS, item.imposto.ICMS.pICMSST, item.imposto.ICMS.pMVAST, valorIPI, item.imposto.ICMS.pRedBC, item.imposto.ICMS.pRedBCST)
                                bcICMS = icms90.calculaBaseIcmsProprio()
                                valueICMS = icms90.calculaValorIcmsProprio()
                                valueFCP = new Fcp(bcICMS, item.imposto.ICMS.pFCP).calculaValorFCP()
                                break;
                            case '40': // 40 - Isenta   
                            case '41': // 41 - Não tributada
                            case '50': // 50 - Suspensão
                            case '60': // 60 - ICMS cobrado anteriormente por substituição tributária
                            case '':
                            case null:
                                break;
                            default:
                                throw new Error(`CST ICMS ${item.imposto.ICMS.CST} não esperado!`)
                        }

                    }
                    // CSOSN - Somente de Simples Nacional 101 pra cima
                    if ((nfeData.emitente.CRT === Crt.SimplesNacional)) {
                        switch (item.imposto.ICMS.CSOSN ?? null) {

                            case '101': // 101 - Simples Nacional - Tributada pelo Simples Nacional com permissão de crédito
                                const icms101 = new Icms101(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, item.imposto.ICMS.pCredSN, item.imposto.ICMS.pRedBC)
                                bcICMS = icms101.calculaBaseIcmsProprio()
                                valueICMS = new ValorIcmsProprio(bcICMS, item.imposto.ICMS.pICMS).calculaValorIcmsProprio()
                                valueFCP = new Fcp(bcICMS, item.imposto.ICMS.pFCP).calculaValorFCP()
                                break;
                            case '900':  // 900 - Simples Nacional - Outros
                                bcICMS = new BaseReduzidaIcmsProprio(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, item.imposto.ICMS.pRedBC, (item.imposto.IPI?.vIPI ?? 0)).calculaBaseReduzidaIcmsProprio()
                                valueICMS = new ValorIcmsProprio(bcICMS, item.imposto.ICMS.pICMS).calculaValorIcmsProprio()
                                valueFCP = new Fcp(bcICMS, item.imposto.ICMS.pFCP).calculaValorFCP()
                                break;
                            // Nas condições abaixo não há cobrança de tributo    
                            case '102': // 102 - Simples Nacional - Tributada pelo Simples Nacional sem permissão de crédito
                            case '103': // 103 - Simples Nacional - Isenção do ICMS no Simples Nacional para faixa de receita bruta
                            case '300': // 300 - Simples Nacional - Imune
                            case '400': // 400 - Simples Nacional - Não tributada pelo Simples Nacional
                            case '500': // 500 - Simples Nacional - ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação 500 - Simples Nacional - ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação
                            case null:
                                break;
                            default:
                                throw new Error(`CSOSN ICMS ${item.imposto.ICMS.CSOSN} não esperado!`)
                        }
                    }
                }

                //COFINS
                let bcCOFINS = 0
                let valueCOFINS = 0

                if (item.imposto.COFINS) {
                    switch (item.imposto.COFINS.CST) {
                        case '01': // 01 - Operação Tributável com Alíquota Básica
                            const cofins01 = new Cofins01(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, item.imposto.COFINS.pCOFINS, valueICMS);
                            bcCOFINS = cofins01.calculaBaseCofins()
                            valueCOFINS = cofins01.calculaValorCofins()
                            break;
                        case '02': // 02 - Operação Tributável com Alíquota Diferenciada
                            const cofins02 = new Cofins02(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, item.imposto.COFINS.pCOFINS, valueICMS)
                            bcCOFINS = cofins02.calculaBaseCofins()
                            valueCOFINS = cofins02.calculaValorCofins()
                            break;
                        case '03': // 03 - Operação Tributável com Alíquota por Unidade de Medida de Produto
                            bcCOFINS = new BaseCofins(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, valueICMS).calcularBaseCofins()
                            valueCOFINS = new Cofins03(bcCOFINS, item.imposto.COFINS.pCOFINS).calculaValorCofins();
                            break;
                        case '49': // 49 - Outras Operações de Saída    
                        case '99': // 99 - Outras Operações
                            bcCOFINS = new BaseCofins(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, valueICMS).calcularBaseCofins()
                            valueCOFINS = Utils.roundToNearest(bcCOFINS * (item.imposto.COFINS.pCOFINS / 100));
                            break;
                        // Nas condições abaixo não há cobrança de tributo
                        case '04': // 04 - Operação Tributável Monofásica - Revenda a Alíquota Zero
                        case '05': // 05 - Operação Tributável por Substituição Tributária
                        case '06': // 06 - Operação Tributável a Alíquota Zero 
                        case '07': // 07 - Operação Isenta da Contribuição
                        case '08': // 08 - Operação sem Incidência da Contribuição  
                        case '09': // 09 - Operação com Suspensão da Contribuição
                        case null:
                        case '':
                            break;
                        default:
                            throw new Error(`CST COFINS ${item.imposto.COFINS.CST} não esperado!`)
                    }
                }

                //PIS 
                let bcPIS = 0
                let valuePIS = 0

                if (item.imposto.PIS) {

                    switch (item.imposto.PIS.CST) {
                        case '01': // 01 - Operação Tributável com Alíquota Básica
                            const pis01 = new Pis01(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, item.imposto.PIS.pPIS, valueICMS)
                            bcPIS = pis01.calculaBasePis()
                            valuePIS = pis01.calculaValorPis()
                            break;
                        case '02': // 02 - Operação Tributável com Alíquota Diferenciada
                            const pis02 = new Pis02(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, item.imposto.PIS.pPIS, valueICMS)
                            bcPIS = pis02.calculaBasePis()
                            valuePIS = pis02.calculaValorPis()
                            break;
                        case '03': // 03 - Operação Tributável com Alíquota por Unidade de Medida de Produto
                            bcPIS = new BasePIS(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, valueICMS).calculaBasePIS()
                            valuePIS = new Pis03(bcPIS, item.imposto.PIS.pPIS).calculaValorPis()
                            break;
                        case '49':
                        case '99':
                            bcPIS = new BasePIS(item.valorTotalProdutos, item.valorFrete, item.valorSeguro, item.valorOutro, item.valorDesconto, valueICMS).calculaBasePIS()
                            valuePIS = Utils.roundToNearest(bcPIS * (item.imposto.PIS.pPIS / 100));
                            break;
                        // Nas condições abaixo não há cobrança de tributo
                        case '04': // 04 - Operação Tributável Monofásica - Revenda a Alíquota Zero
                        case '05': // 05 - Operação Tributável por Substituição Tributária
                        case '06': // 06 - Operação Tributável a Alíquota Zero
                        case '07': // 07 - Operação Isenta da Contribuição
                        case '08': // 08 - Operação sem Incidência da Contribuição
                        case '09': // 09 - Operação com Suspensão da Contribuição
                        case '':
                        case null:
                            break;
                        default:
                            throw new Error(`CST PIS ${item.imposto.PIS.CST} não esperado!`)

                    }
                }

                return {
                    ...item, imposto: {
                        ...item.imposto,
                        ...((item.imposto.ICMS.CST || item.imposto.ICMS.CSOSN) ? {
                            ICMS: {
                                ...item.imposto.ICMS,
                                vBC: bcICMS,
                                vICMS: valueICMS,
                                vFCP: valueFCP
                            }
                        } : { ICMS: undefined }
                        ),
                        ...(item.imposto.COFINS.CST ? {
                            COFINS: {
                                ...item.imposto.COFINS,
                                vBC: bcCOFINS,
                                vCOFINS: valueCOFINS
                            }
                        } : { COFINS: undefined }
                        ),
                        ...(item.imposto.IPI?.CST ?
                            {
                                IPI: {
                                    ...item.imposto.IPI,
                                    vBC: bcIPI,
                                    vIPI: valorIPI
                                }
                            } : { IPI: undefined }
                        ),
                        ...(item.imposto.PIS.CST ? {
                            PIS: {
                                ...item.imposto.PIS,
                                vBC: bcPIS,
                                vPIS: valuePIS
                            }
                        } : { PIS: undefined }),
                        vTotTrib: valueICMS + valueCOFINS + valorIPI + valueFCP + valuePIS
                    }
                }
            })
        }

        // Preenche totais
        let totalizedNfe: CreateFiscalNoteInterface = {
            ...NfeWithTaxes,
            total: {
                ICMS: {
                    ...nfeData.total.ICMS,
                    vBC: NfeWithTaxes.produtos.reduce((acc, product) => { return acc + (product.imposto.ICMS?.vBC ?? 0) }, 0),
                    vCOFINS: NfeWithTaxes.produtos.reduce((acc, product) => { return acc + (product.imposto.COFINS?.vCOFINS ?? 0) }, 0),
                    vDesc: NfeWithTaxes.produtos.reduce((acc, product) => { return acc + product.valorDesconto }, 0),
                    vICMS: NfeWithTaxes.produtos.reduce((acc, product) => { return acc + (product.imposto.ICMS?.vICMS ?? 0) }, 0),
                    vPIS: NfeWithTaxes.produtos.reduce((acc, product) => { return acc + (product.imposto.PIS?.vPIS ?? 0) }, 0),
                    vIPI: NfeWithTaxes.produtos.reduce((acc, product) => { return acc + (product.imposto.IPI?.vIPI ?? 0) }, 0),
                    vProd: NfeWithTaxes.produtos.reduce((acc, product) => { return acc + product.valorTotalProdutos }, 0),
                    vTotTrib: NfeWithTaxes.produtos.reduce((acc, product) => { return acc + product.imposto.vTotTrib }, 0)
                }
            }
        }

        totalizedNfe = {
            ...totalizedNfe,
            total: {
                ICMS: {
                    ...totalizedNfe.total.ICMS,
                    vNF: (totalizedNfe.total.ICMS.vProd +
                        totalizedNfe.total.ICMS.vST +
                        totalizedNfe.total.ICMS.vFCPST +
                        totalizedNfe.total.ICMS.vFrete +
                        totalizedNfe.total.ICMS.vSeg +
                        totalizedNfe.total.ICMS.vOutro +
                        totalizedNfe.total.ICMS.vII +
                        totalizedNfe.total.ICMS.vIPI -
                        totalizedNfe.total.ICMS.vDesc)
                }
            }
        }


        console.log(totalizedNfe)
        console.log(totalizedNfe.produtos[0].imposto)

        console.log(JSON.stringify(totalizedNfe))

        const result: NFeResponse = await emiteNfe(totalizedNfe, userId, model)

        const dbNfe = await prisma.fiscalNotes.create({
            data: {
                enviroment: Number(totalizedNfe.ambiente),
                keyNF: onlyNumbersStr(result.NFe),
                numberNF: totalizedNfe.nNF,
                protocol: result.Protocolo,
                totalAmount: totalizedNfe.total.ICMS.vNF,
                xml: result.xml,
                serieNFId: totalizedNfe.serie,
                sellId: sellData[0].id,
                modelNFId: model === modelEnum.NFE ? fiscalModels.nfe55 : fiscalModels.nfce65,
                statusNFId: fiscalStatusNf.autorizada,
                stateId: sellData[0].store.addressRelation.city.stateId,
                storeId: userId
            }
        })

        // Atualizar o id da ultima NFCE/NFE
        await prisma.user.update({
            data: {
                ...(model === modelEnum.NFCE ?
                    { lastNumberNFCE: totalizedNfe.nNF } :
                    { lastNumberNF: totalizedNfe.nNF })
            }
            ,
            where: { id: userId }
        })

        // Cria Evento Emissao
        await prisma.fiscalEvents.create({
            data: {
                protocol: result.Protocolo,
                fiscalEventTypeId: fiscalEvent.Emissao,
                fiscalNoteId: dbNfe.id,
            }
        })

        if (result.cStat !== '100') throw new Error('Status da emissão: ' + result.cMsg)

        const pathLogo = sellData[0].store.logo ? path.join(rootPath(), sellData[0].store.logo.path, sellData[0].store.logo.nameFile) : ''
        const logoBase64 = pathLogo ? fs.readFileSync(pathLogo).toString('base64') : null

        await generateDanfeAndRespond({
            NFe: result.NFe,
            profile: result.profile,
            xml: result.xml, model,
            logoBase64,
            positionYLogoNFe: sellData[0].store.positionYLogoNFe ?? 0,
            positionYEmitDataNFe: sellData[0].store.positionYEmitDataNFe ?? 0
        }, response)

    } catch (error) {
        console.log(error)
        return response.status(400).json({ erro: 'Ocorreu uma falha ao emitir nota fiscal! ' + (error as Error).message });
    }
}



interface GenerateDanfeParams {
    NFe: string;
    profile: string;
    xml: string;
    model: 'NFCE' | 'NFE',
    logoBase64: string | null,
    positionYEmitDataNFe: number,
    positionYLogoNFe: number
}

export const generateDanfeAndRespond = async (
    params: GenerateDanfeParams,
    response: Response
): Promise<Response> => {
    try {
        const { generateDanfe } = useDanfeGeneratorApi();
        const danfe = await generateDanfe(params);
        console.log(danfe)
        return response.status(200).json(danfe);
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
                                    taxIcmsNfe: { include: { taxCstIcms: true, taxModalityBC: true } },
                                    taxIcmsNfce: { include: { taxCstIcms: true } },
                                    taxIcmsNoPayer: { include: { taxCstIcms: true } },
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
            store: { include: { addressRelation: { include: { city: { include: { state: true } } } }, logo: true } }
        }, where: {
            AND: [
                { id: sellId },
                { storeId: userId }
            ]
        }
    });

    return sellData
}