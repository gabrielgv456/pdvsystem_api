EXECUTE BLOCK
RETURNS (
 IDPRODUTO INTEGER
)
AS
BEGIN
   FOR

   SELECT P.T050IDPROD
   FROM T050PRODUTOS P 
   WHERE P.T050IDPROD IN (
    SELECT S.T053PRODUTO FROM T053SALDOS S 
    WHERE S.T053PRODUTO NOT IN (
        SELECT DISTINCT MV.T094PRODUTO
        FROM T094MOVPROD MV
        WHERE MV.T094DATA > DATEADD(MONTH,-12, CURRENT_DATE)
    ) 
    GROUP BY S.T053PRODUTO
    HAVING SUM(S.T053SALDO) <= 0
    AND SUM(S.T053CONSIGNACAO) <= 0
    AND SUM(S.T053TERCEIROS) <=0
    AND SUM(S.T053EMTRANS) <=0
    AND SUM(S.T053MOSTRUARIO) <=0
   
   ) 
   AND P.T050ATIVO = 'S'
   AND P.T050TIPOPROD = 3 --(MERC REVENDA)

   INTO :IDPRODUTO
    DO
    BEGIN
     --UPDATE T050PRODUTOS PR SET PR.T050ATIVO = 'N' WHERE PR.T050IDPROD = :IDPRODUTO;
     SUSPEND;
    END
END

]

SELECT
   P.T050IDPROD,
   SUM(S.T053SALDO)
   FROM T050PRODUTOS P
   INNER JOIN T053SALDOS S
   ON S.T053PRODUTO = P.T050IDPROD
   INNER JOIN T094MOVPROD MV
   ON  MV.T094PRODUTO = P.T050IDPROD
   --AND MV.T094ESTOQUE = 0
   WHERE P.T050ATIVO = 'S'
   AND P.T050TIPOPROD = 3 --(MERC REVENDA)
   AND MV.T094DATA > DATEADD(MONTH,-12, CURRENT_DATE)
   GROUP BY P.T050IDPROD
   --HAVING SUM(S.T053SALDO) <= 0
   --AND SUM(S.T053CONSIGNACAO) <= 0
   --AND SUM(S.T053TERCEIROS) <=0
   -- SUM(S.T053EMTRANS) <=0

EXECUTE BLOCK
RETURNS (
 IDPRODUTO INTEGER
)

AS
BEGIN
   FOR

WITH MOV AS (
     SELECT DISTINCT MV.T094PRODUTO
     FROM T094MOVPROD MV
     WHERE MV.T094DATA > DATEADD(MONTH,-12, CURRENT_DATE)
),
PRD AS (
    SELECT P.T050IDPROD
    FROM T050PRODUTOS P
    WHERE
    P.T050ATIVO = 'S'
    AND P.T050TIPOPROD = 3 --(MERC REVENDA)
), SLD AS (
   SELECT S.T053PRODUTO FROM T053SALDOS S
   GROUP BY S.T053PRODUTO
   HAVING SUM(S.T053SALDO) <= 0
   AND SUM(S.T053CONSIGNACAO) <= 0
   AND SUM(S.T053TERCEIROS) <=0
   AND SUM(S.T053EMTRANS) <=0
   AND SUM(S.T053MOSTRUARIO) <=0
)
 
 SELECT PRD.T050IDPROD FROM PRD
 INNER JOIN SLD ON SLD.T053PRODUTO = PRD.T050IDPROD
 WHERE PRD.T050IDPROD NOT IN (
  SELECT MOV.T094PRODUTO
  FROM MOV
 )
INTO :IDPRODUTO
    DO
    BEGIN
     UPDATE T050PRODUTOS PR SET PR.T050ATIVO = 'N' WHERE PR.T050IDPROD = :IDPRODUTO;
     SUSPEND;
    END
END










1642

EXECUTE BLOCK
RETURNS (
 IDPRODUTO INTEGER
)
AS

declare variable ULT_HIG VARCHAR(100);
declare VARIABLE DATA_BASE DATE;

BEGIN

SELECT VALOR, DATEADD(MONTH,-12,CURRENT_DATE )
FROM CONFIGURACOES C
WHERE C.PARAMETRO = 'ULT_HIG_PRODUTOS'
INTO :ULT_HIG, :DATA_BASE;


IF (CAST(:ULT_HIG AS DATE) >= :DATA_BASE) THEN BEGIN
    SUSPEND;
    EXIT;
END

FOR
    WITH MOV AS (
         SELECT DISTINCT MV.T094PRODUTO
         FROM T094MOVPROD MV
         WHERE MV.T094DATA > DATEADD(MONTH,-12, CURRENT_DATE)
    ),
    PRD AS (
        SELECT P.T050IDPROD
        FROM T050PRODUTOS P
        WHERE
        P.T050ATIVO = 'S'
        AND P.T050TIPOPROD = 3 --(MERC REVENDA)
    ), SLD AS (
       SELECT S.T053PRODUTO FROM T053SALDOS S
       GROUP BY S.T053PRODUTO
       HAVING SUM(S.T053SALDO) <= 0
       AND SUM(S.T053CONSIGNACAO) <= 0
       AND SUM(S.T053TERCEIROS) <=0
       AND SUM(S.T053EMTRANS) <=0
       AND SUM(S.T053MOSTRUARIO) <=0
    )
     
     SELECT PRD.T050IDPROD FROM PRD
     INNER JOIN SLD ON SLD.T053PRODUTO = PRD.T050IDPROD
     WHERE PRD.T050IDPROD NOT IN (
      SELECT MOV.T094PRODUTO
      FROM MOV
     )
    INTO :IDPRODUTO
        DO
        BEGIN
          UPDATE T050PRODUTOS PR SET PR.T050ATIVO = 'N' WHERE PR.T050IDPROD = :IDPRODUTO;
          UPDATE CONFIGURACOES C SET C.VALOR = CURRENT_DATE;
          SUSPEND;
        END
END






EXECUTE BLOCK
RETURNS (
 IDPRODUTO INTEGER,
 DESCRICAO VARCHAR(120),
 ARTIGO VARCHAR(40),
 ULT_ALTERACAO TIMESTAMP
)
AS

DECLARE VARIABLE ULT_HIG VARCHAR(100);
DECLARE VARIABLE DATA_BASE DATE;

BEGIN

SELECT VALOR, DATEADD(MONTH,-12,CURRENT_DATE )
FROM CONFIGURACOES C
WHERE C.PARAMETRO = 'ULT_HIG_PRODUTOS'
INTO :ULT_HIG, :DATA_BASE;


IF (CAST(:ULT_HIG AS DATE) >= :DATA_BASE OR :ULT_HIG IS NULL ) THEN BEGIN
    SUSPEND;
    EXIT;
END

FOR
    WITH MOV AS (
         SELECT DISTINCT MV.T094PRODUTO
         FROM T094MOVPROD MV
         WHERE MV.T094DATA > DATEADD(MONTH,-12, CURRENT_DATE)
    ),
    PRD AS (
        SELECT P.T050IDPROD, P.T050DESCRICAO,P.T050LASTCHANGE, A.T047DESCRICAO
        FROM T050PRODUTOS P
        INNER JOIN T047ARTIGOS A
        ON A.T047IDARTIGO = P.T050ARTIGO
        WHERE
        P.T050ATIVO = 'S'
        AND P.T050TIPOPROD = 3 --(MERC REVENDA)
    ), SLD AS (
       SELECT * FROM T053SALDOS S
       GROUP BY S.T053PRODUTO
       HAVING SUM(S.T053SALDO) <= 0
       AND SUM(S.T053CONSIGNACAO) <= 0
       AND SUM(S.T053TERCEIROS) <=0
       AND SUM(S.T053EMTRANS) <=0
       AND SUM(S.T053MOSTRUARIO) <=0
    )
     
     SELECT PRD.T050IDPROD, PRD.T050DESCRICAO, PRD.T047DESCRICAO, PRD.T050LASTCHANGE FROM PRD
     INNER JOIN SLD ON SLD.T053PRODUTO = PRD.T050IDPROD
     WHERE PRD.T050IDPROD NOT IN (
      SELECT MOV.T094PRODUTO
      FROM MOV
     )
    INTO :IDPRODUTO, :DESCRICAO, :ARTIGO,:ULT_ALTERACAO
        DO
        BEGIN
          --UPDATE T050PRODUTOS PR SET PR.T050ATIVO = 'N' WHERE PR.T050IDPROD = :IDPRODUTO;
          --UPDATE CONFIGURACOES C SET C.VALOR = CURRENT_DATE WHERE C.PARAMETRO = 'ULT_HIG_PRODUTOS';
          SUSPEND;
        END
END





EXECUTE BLOCK
RETURNS (
 IDPRODUTO INTEGER,
 DESCRICAO VARCHAR(120),
 ARTIGO VARCHAR(40),
 ULT_ALTERACAO TIMESTAMP
)
AS

DECLARE VARIABLE ULT_HIG VARCHAR(100);
DECLARE VARIABLE DATA_BASE DATE;

BEGIN

SELECT VALOR, DATEADD(MONTH,-12,CURRENT_DATE )
FROM CONFIGURACOES C
WHERE C.PARAMETRO = 'ULT_HIG_PRODUTOS'
INTO :ULT_HIG, :DATA_BASE;


--IF (CAST(:ULT_HIG AS DATE) >= :DATA_BASE OR :ULT_HIG IS NULL ) THEN BEGIN
--    SUSPEND;
--    EXIT;
--END

FOR
    WITH MOV AS (
         SELECT DISTINCT MV.T094PRODUTO
         FROM T094MOVPROD MV
         WHERE MV.T094DATA > DATEADD(MONTH,-12, CURRENT_DATE)
    ),
    PRD AS (
        SELECT P.T050IDPROD, P.T050DESCRICAO,P.T050LASTCHANGE, A.T047DESCRICAO
        FROM T050PRODUTOS P
        INNER JOIN T047ARTIGOS A
        ON A.T047IDARTIGO = P.T050ARTIGO
        WHERE
        P.T050ATIVO = 'S'
        AND P.T050TIPOPROD = 3 --(MERC REVENDA)
    ), SLD AS (
       SELECT S.T053PRODUTO FROM T053SALDOS S
       GROUP BY S.T053PRODUTO
       HAVING SUM(S.T053SALDO) <= 0
       AND SUM(S.T053CONSIGNACAO) <= 0
       AND SUM(S.T053TERCEIROS) <=0
       AND SUM(S.T053EMTRANS) <=0
       AND SUM(S.T053MOSTRUARIO) <=0
    )
     
     SELECT PRD.T050IDPROD, PRD.T050DESCRICAO, PRD.T047DESCRICAO, PRD.T050LASTCHANGE FROM PRD
     INNER JOIN SLD ON SLD.T053PRODUTO = PRD.T050IDPROD
     WHERE PRD.T050LASTCHANGE <= DATEADD(MONTH,-12,CURRENT_DATE )
     AND PRD.T050IDPROD NOT IN (
      SELECT MOV.T094PRODUTO
      FROM MOV
     )
    INTO :IDPRODUTO, :DESCRICAO, :ARTIGO,:ULT_ALTERACAO
        DO
        BEGIN
          --UPDATE T050PRODUTOS PR SET PR.T050ATIVO = 'N' WHERE PR.T050IDPROD = :IDPRODUTO;
          --UPDATE CONFIGURACOES C SET C.VALOR = CURRENT_DATE WHERE C.PARAMETRO = 'ULT_HIG_PRODUTOS';
          SUSPEND;
        END
END




















3787

Select
  e.nome   As Empresa,
  pc.nome As Plano,
  lpad(pcc.codigo,4,0) || '-' || pcc.nome As ContaCont,
  lpad(b.codigo,4,0) || '-' || b.nome As Base,
  lpad(lv.codigo,4,0) || '-' || lv.nome As ListaVerba,
  lpad(v.codigo,4,0) || '-' || v.nome   As Verba,
  case when lvv.operacao = 1 then '+'  when lvv.operacao = 2 then '-' when lvv.operacao = 3 then '=' else 'TEM COISA ERRADA' end   As Operacao,
  case pcc.tipocalculo when 'C' then 'Complem.' when 'N' then 'Normal' else 'Todos' End TpCalc,
  coalesce(act.nome,'<<Todos>>') AlocContabil,
  pcc.tipolancamento As "Tipo lanç",
  CASE PCC.LANCAMENTO WHEN 'E' THEN '(E)mpresa' WHEN 'U' THEN '(U)nidade' WHEN 'C' THEN '(C)entro de custo' WHEN 'D' THEN '(D)ependente' WHEN 'F' THEN '(F)uncionário' WHEN 'H' THEN '(H)ierarquia contábil' end "Lancamento",
  CASE WHEN c.tipo = 'A' THEN 'Ativo' WHEN c.tipo = 'P' THEN 'Passivo' WHEN c.tipo = 'R' THEN 'Resultado' else 'TEM COISA ERRADA AQUI' End "Nat. conta",
  pcc.contalancamento As "Conta lanç.",
  c.estrutura || ' ' || c.nome As "Conta 01",
  c.codigoreduzido || ' ' || c.nome As "Conta 02",
  c.nome As "Conta 03",
  CONTRAPARTIDA As "Contrapartida",
  coalesce(Case when pcc.tipolancamento = 'D' then pcc.contalancamento else CONTRAPARTIDA End,'-') As CDeb,
  coalesce(Case when pcc.tipolancamento = 'C' then pcc.contalancamento else CONTRAPARTIDA End,'-') As CCre,
  COALESCE(LPAD(HISTORICOPADRAO,5,0),'-') As HP,
  COALESCE(HP.NOME,'') As HISTORICOPADRAO,
  COMPLEMENTOHISTORICO  As Compl,
  case FNORMAL   when 0 then '' else 'Folha;' End ||
  case ADTO      when 0 then '' else 'Adto Sal.;' End ||
  case ADTO13    when 0 then '' else 'Adto 13º;' End ||
  case DECTER    when 0 then '' else '13º sal;' End ||
  case RESCISAO  when 0 then '' else 'Rescisão;' End ||
  case FERIAS    when 0 then '' else 'Férias;' End ||
  case FERIASCOL when 0 then '' else 'Férias col.;' End ||
  case PROVISAO  when 0 then '' else 'Provisão;' End ||
  case PLR       when 0 then '' else 'PLR;' End FOLHAS,
  '-' GPS,
  case FNORMAL   when 0 then '-' else 'S' End FNORMAL,
  case ADTO      when 0 then '-' else 'S' End ADTO,
  case ADTO13    when 0 then '-' else 'S' End ADTO13,
  case DECTER    when 0 then '-' else 'S' End DECTER,
  case RESCISAO  when 0 then '-' else 'S' End RESCISAO,
  case FERIAS    when 0 then '-' else 'S' End FERIAS,
  case FERIASCOL when 0 then '-' else 'S' End FERIASCOL,
  case PROVISAO  when 0 then '-' else 'S' End PROVISAO,
  case PLR       when 0 then '-' else 'S' End PLR,
  1 As Qde
from
  fp_verbas V
  Inner join fp_listaverbaverbas lvv On lvv.verba = v.handle
  Inner join fp_listasverbas Lv On lv.handle = lvv.listaverbas
  Inner join fp_baselistasverbas blv On blv.listaverbas = lv.handle
  Inner join fp_bases b on b.handle = blv.baseacumulacao
  Inner join FP_PLANOCONTAS PCC On Pcc.base = b.handle
  Inner join FP_PLANOSCONTABEIS PC On pc.handle = pcc.plano
  Inner join adm_parametrofp PFP On pfp.planocontabil = PC.handle
  Inner join adm_empresas E on e.handle = pfp.empresa
  INNER JOIN ADM_PARAMETROFP PFP ON PFP.EMPRESA = E.HANDLE
  Left join (Select
               b.handle,
               max(case f.handle when 10 then 1 when 11 then 1 else 0 end) FNORMAL,
               max(case f.handle when 10 then 1 when 18 then 1 else 0 end) ADTO,
               max(case f.handle when 10 then 1 when 21 then 1 else 0 end) ADTO13,
               max(case f.handle when 10 then 1 when 22 then 1 else 0 end) DECTER,
               max(case f.handle when 10 then 1 when 23 then 1 else 0 end) RESCISAO,
               max(case f.handle when 10 then 1 when 24 then 1 else 0 end) FERIAS,
               max(case f.handle when 10 then 1 when 26 then 1 else 0 end) FERIASCOL,
               max(case f.handle when 10 then 1 when 37 then 1 else 0 end) PROVISAO,
               max(case f.handle when 10 then 1 when 69 then 1 else 0 end) PLR
             from
               fp_bases b
               Inner join fp_basefolhas bf on bf.base = b.handle
               Inner join Z_FLAGSITENS F On bf.flagitem = f.handle
             GROUP BY
               b.handle,
               B.NOME) STP On stp.handle = b.handle
  Left join fp_alocacoescontabeis act On act.handle = pcc.alocacaocontabil
  left join BENNER_CORP.EMPRESAS EC ON EC.CODIGOREDUZIDO = PFP.CODIGOCONTABILIZACAO
  Left join BENNER_CORP.CT_HISTORICOSPADROES HP On HP.codigo = COALESCE(HISTORICOPADRAO,0) and hp.empresa = ec.handle
  Left Join BENNER_CORP.CT_CONTAS C ON C.codigoreduzido = COALESCE(pcc.contalancamento,'0') and C.empresa = ec.handle
Where 1=1
  And e.handle = :"Empresa*"
  And (:Verba is null or v.codigo = :Verba)
  And (:"Conta contábil" is null 
    or :"Conta contábil" = pcc.contalancamento 
    or :"Conta contábil" = pcc.CONTRAPARTIDA)

Union

Select
  e.nome   As Empresa,
  pc.nome As Plano,
  lpad(pcc.codigo,4,0) || '-' || pcc.nome As ContaCont,
  'GPS' As Base,
  'GPS' As ListaVerba,
  pcc.nome As Verba,
  '+' As Operacao,
  case pcc.tipocalculo when 'C' then 'Complem.' when 'N' then 'Normal' else 'Todos' End TpCalc,
  coalesce(act.nome,'<<Todos>>') AlocContabil,
  pcc.tipolancamento As "Tipo lanç",
  CASE PCC.LANCAMENTO WHEN 'E' THEN '(E)mpresa' WHEN 'U' THEN '(U)nidade' WHEN 'C' THEN '(C)entro de custo' WHEN 'D' THEN '(D)ependente' WHEN 'F' THEN '(F)uncionário' WHEN 'H' THEN '(H)ierarquia contábil' end "Lancamento",
  CASE WHEN c.tipo = 'A' THEN 'Ativo' WHEN c.tipo = 'P' THEN 'Passivo' WHEN c.tipo = 'R' THEN 'Resultado' else 'TEM COISA ERRADA AQUI' End "Nat. conta",
  pcc.contalancamento As "Conta lanç.",
  c.estrutura || ' ' || c.nome As "Conta 01",
  c.codigoreduzido || ' ' || c.nome As "Conta 02",
  c.nome As "Conta 03",
  CONTRAPARTIDA As "Contrapartida",
  coalesce(Case when pcc.tipolancamento = 'D' then pcc.contalancamento else CONTRAPARTIDA End,'-') As CDeb,
  coalesce(Case when pcc.tipolancamento = 'C' then pcc.contalancamento else CONTRAPARTIDA End,'-') As CCre,
  COALESCE(LPAD(HISTORICOPADRAO,5,0),'-') As HP,
  COALESCE(HP.NOME,'') As HISTORICOPADRAO,
  COMPLEMENTOHISTORICO  As Compl,
  'GPS' FOLHAS,
  'S' GPS, '-' FNORMAL, '-' ADTO, '-' ADTO13, '-' DECTER, 
  '-' RESCISAO, '-' FERIAS, '-' FERIASCOL, '-' PROVISAO, '-' PLR,
  1 As Qde
from
  FP_PLANOCONTAS PCC 
  Inner join FP_PLANOSCONTABEIS PC On pc.handle = pcc.plano
  Inner join adm_parametrofp PFP On pfp.planocontabil = PC.handle
  Inner join adm_empresas E on e.handle = pfp.empresa
  Left join fp_alocacoescontabeis act On act.handle = pcc.alocacaocontabil
  Left join BENNER_CORP.CT_HISTORICOSPADROES HP On HP.codigo = COALESCE(HISTORICOPADRAO,0) and hp.empresa = e.handle
  Left Join BENNER_CORP.CT_CONTAS C ON C.codigoreduzido = COALESCE(pcc.contalancamento,'0') and C.empresa = e.handle
Where 1=1
  And e.handle = :"Empresa*"
  And PCC.situacao = 4
  And pcc.nome like '*GPS%'
  And (:Verba is null or '0' = :Verba)
  And (:"Conta contábil" is null 
    or :"Conta contábil" = pcc.contalancamento 
    or :"Conta contábil" = pcc.CONTRAPARTIDA)

Union

Select
  /*CONTRAPARTIDA*/
  e.nome   As Empresa,
  pc.nome As Plano,
  lpad(pcc.codigo,4,0) || '-' || pcc.nome As ContaCont,
  'GPS' As Base,
  'GPS' As ListaVerba,
  pcc.nome As Verba,
  '+' As Operacao,
  case pcc.tipocalculo when 'C' then 'Complem.' when 'N' then 'Normal' else 'Todos' End TpCalc,
  coalesce(act.nome,'<<Todos>>') AlocContabil,
  Case when pcc.tipolancamento = 'D' then 'C' else 'D' end As "Tipo lanç",
  CASE PCC.LANCAMENTO WHEN 'E' THEN '(E)mpresa' WHEN 'U' THEN '(U)nidade' WHEN 'C' THEN '(C)entro de custo' WHEN 'D' THEN '(D)ependente' WHEN 'F' THEN '(F)uncionário' WHEN 'H' THEN '(H)ierarquia contábil' end "Lancamento",
  CASE WHEN c.tipo = 'A' THEN 'Ativo' WHEN c.tipo = 'P' THEN 'Passivo' WHEN c.tipo = 'R' THEN 'Resultado' else 'TEM COISA ERRADA AQUI' End "Nat. conta",
  CONTRAPARTIDA As "Conta lanç.",
  c.estrutura || ' ' || c.nome As "Conta 01",
  c.codigoreduzido || ' ' || c.nome As "Conta 02",
  c.nome As "Conta 03",
  pcc.contalancamento As "Contrapartida",
  coalesce(Case when pcc.tipolancamento = 'C' then pcc.contalancamento else CONTRAPARTIDA End,'-') As CDeb,
  coalesce(Case when pcc.tipolancamento = 'D' then pcc.contalancamento else CONTRAPARTIDA End,'-') As CCre,
  COALESCE(LPAD(HISTORICOPADRAO,5,0),'-') As HP,
  COALESCE(HP.NOME,'') As HISTORICOPADRAO,
  COMPLEMENTOHISTORICO  As Compl,
  'GPS' FOLHAS,
  'S' GPS, '-' FNORMAL, '-' ADTO, '-' ADTO13, '-' DECTER, 
  '-' RESCISAO, '-' FERIAS, '-' FERIASCOL, '-' PROVISAO, '-' PLR,
  1 As Qde
from
  FP_PLANOCONTAS PCC 
  Inner join FP_PLANOSCONTABEIS PC On pc.handle = pcc.plano
  Inner join adm_parametrofp PFP On pfp.planocontabil = PC.handle
  Inner join adm_empresas E on e.handle = pfp.empresa
  Left join fp_alocacoescontabeis act On act.handle = pcc.alocacaocontabil
  Left join BENNER_CORP.CT_HISTORICOSPADROES HP On HP.codigo = COALESCE(HISTORICOPADRAO,0) and hp.empresa = e.handle
  Left Join BENNER_CORP.CT_CONTAS C ON C.codigoreduzido = COALESCE(pcc.CONTRAPARTIDA,'0') and C.empresa = e.handle
Where 1=1
  And e.handle = :"Empresa*"
  And PCC.situacao = 4
  And pcc.nome like '*GPS%'
  And (:Verba is null or '0' = :Verba)
  And (:"Conta contábil" is null 
    or :"Conta contábil" = pcc.contalancamento 
    or :"Conta contábil" = pcc.CONTRAPARTIDA)
Order by
  1, 2, 9, 3, 4, 5, 6















3479

 Select 
  Negocio, Empresa, Unidade, CodUnid, CodAtend, Matricula, Funcionario, Cargo, AlocQuadro, GrupoOcupacional, CCGERENCIAL, EstruturaCC, Ccusto, CC, NivelEscolaridade,
  Hierarquia, Email, EstCivil, Sexo, SituacaoAtual, MesNasc, to_char(Admissao,'mm/yyyy') MesAdm, Admissao, TempodeCasa, Quartil, FormaPgto, Banco, Agencia,
  Mesesdecasa, FaixaTempoCasa, Datanascimento, Idade, FaixaEtaria, MotivoEstab, Estabilidade, TiposalarioAtual, Salarioatual,
  SalAtual, FaixaSalarioAtual, SindDataBase, Sindicato, SindCNPJ, GarantSindVariável, SalNormativo, InicioSal, Tiposalario,  Salario,
  Sal, FaixaSalario, Reajuste, UltAlteracao UltReaj, Insalubridade, Periculosidade, AdtoSal, Case when Insalubridade > 0 then 'Insalubridade' when Periculosidade > 0 then 'Periculosidade' Else '-' end Adicional,
  case when Salario > 0 then Salario+Insalubridade+Periculosidade else GarantSindVariável end As CustoFixo,
  Qde, Qdeemail, Filhos, PCD, QdePCD, TIPODEFICIENCIA
From
     (Select
        --case when u.K_CODFINANCEIRO = 98000 then 'FAZENDAS' when u.K_CODFINANCEIRO = 99000 then 'FAZENDAS PAULO' Else Lpad(U.Empresa,4,0) End As Empresa,
        Lpad(U.Empresa,4,0) As Empresa,
        case when U.Empresa between 0 and 499 then 'Comércio' when U.Empresa = 4800 then 'Comércio' when U.Empresa = 6001 then 'Comércio' when U.Empresa = 4501 or U.Empresa = 4901 then 'Indústria' when (U.Empresa between 500 and 699) or (U.Empresa in (9016,9049)) or (u.K_CODFINANCEIRO = 98000) or (u.K_CODFINANCEIRO = 99000) then 'Agro' Else Lpad(U.Empresa,4,0) End As Negocio,
        Lpad(U.Codigo,4,0) CodUnid,
        Lpad(U.Codigo,4,0) || '-' || U.Nome Unidade,
        F.Matricula,
        lpad(coalesce(f.K_codatendente,0),9,0) As CodAtend,
        F.Nome Funcionario,
        Coalesce(a.nome,'Outros') As AlocQuadro,
        C.Titulo Cargo,
        Case when c.K_GRUPOOCUPACIONAL = 1 then 'Operacional' when c.K_GRUPOOCUPACIONAL = 2 then 'Administrativo' when c.K_GRUPOOCUPACIONAL = 3 then 'Gerencial' when c.K_GRUPOOCUPACIONAL = 4 then 'Técnico/profissional' else '-' End GrupoOcupacional,
        SCC.CCGERENCIAL,
        coalesce(cc.estrutura,lpad(cc.codigo,6,0)) EstruturaCC,
        REPLACE(Cc.Nome,Lpad(U.Codigo,4,0),'(L)') Ccusto,
        coalesce(Cc.estrutura,lpad(cc.codigo,6,0)) || '-' || Cc.Nome CC,
        NE.nome As NivelEscolaridade,
        H.Estrutura || '-' || H.Nome As Hierarquia,
        F.K_Emailempresa As Email, 
        Ec.Nome As EstCivil,
        Case When F.Sexo = 'F' Then 'Feminino' Else 'Masculino' End Sexo,
        s.nome As SituacaoAtual,
        Case 
          When extract(month from f.datanascimento) =  1 then '01 Janeiro'
          When extract(month from f.datanascimento) =  2 then '02 Fevereiro'
          When extract(month from f.datanascimento) =  3 then '03 Março'
          When extract(month from f.datanascimento) =  4 then '04 Abril'
          When extract(month from f.datanascimento) =  5 then '05 Maio'
          When extract(month from f.datanascimento) =  6 then '06 Junho'
          When extract(month from f.datanascimento) =  7 then '07 Julho'
          When extract(month from f.datanascimento) =  8 then '08 Agosto'
          When extract(month from f.datanascimento) =  9 then '09 Setembro'
          When extract(month from f.datanascimento) = 10 then '10 Outubro'
          When extract(month from f.datanascimento) = 11 then '11 Novembro'
          When Extract(Month From F.Datanascimento) = 12 Then '12 Dezembro'    
        End MesNasc,
        F.Dataadmissao As Admissao,
        (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End TempodeCasa,
        case 
          when case when Extract(day From Sdt.Datafiltro) > Extract(day From F.Dataadmissao) then 0 else -1 end + ((Extract(year From Sdt.Datafiltro)*12)+Extract(month From Sdt.Datafiltro))-((Extract(year From F.Dataadmissao)*12)+Extract(month From F.Dataadmissao)) < 3 then '1º'
          when case when Extract(day From Sdt.Datafiltro) > Extract(day From F.Dataadmissao) then 0 else -1 end + ((Extract(year From Sdt.Datafiltro)*12)+Extract(month From Sdt.Datafiltro))-((Extract(year From F.Dataadmissao)*12)+Extract(month From F.Dataadmissao)) < 6 then '2º'
          when case when Extract(day From Sdt.Datafiltro) > Extract(day From F.Dataadmissao) then 0 else -1 end + ((Extract(year From Sdt.Datafiltro)*12)+Extract(month From Sdt.Datafiltro))-((Extract(year From F.Dataadmissao)*12)+Extract(month From F.Dataadmissao)) < 12 then '3º'
          else '4º'
        end As Quartil,
        case when Extract(day From Sdt.Datafiltro) > Extract(day From F.Dataadmissao) then 0 else -1 end + ((Extract(year From Sdt.Datafiltro)*12)+Extract(month From Sdt.Datafiltro))-((Extract(year From F.Dataadmissao)*12)+Extract(month From F.Dataadmissao)) Mesesdecasa,
        Case 
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <  1 Then  '00-11 meses'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 5 Then  '01-05 anos'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 10 Then '06-10 anos'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 15 Then '11-15 anos'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 20 Then '16-20 anos'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 25 Then '21-25 anos'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 30 Then '26-30 anos'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 35 Then '31-35 anos'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Dataadmissao)-1)+Case When Extract(Month From F.Dataadmissao) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Dataadmissao) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Dataadmissao) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 40 Then '36-40 anos'
          Else '41 anos p/ cima'
        End As FaixaTempoCasa,
        (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Datanascimento)-1)+Case When Extract(Month From F.Datanascimento) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Datanascimento) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Datanascimento) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End Idade,
        F.Datanascimento,
        Case 
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Datanascimento)-1)+Case When Extract(Month From F.Datanascimento) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Datanascimento) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Datanascimento) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 18 Then '00-18'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Datanascimento)-1)+Case When Extract(Month From F.Datanascimento) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Datanascimento) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Datanascimento) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 25 Then '19-25'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Datanascimento)-1)+Case When Extract(Month From F.Datanascimento) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Datanascimento) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Datanascimento) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 30 Then '26-30'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Datanascimento)-1)+Case When Extract(Month From F.Datanascimento) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Datanascimento) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Datanascimento) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 35 Then '31-35'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Datanascimento)-1)+Case When Extract(Month From F.Datanascimento) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Datanascimento) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Datanascimento) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 40 Then '36-40'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Datanascimento)-1)+Case When Extract(Month From F.Datanascimento) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Datanascimento) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Datanascimento) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 45 Then '41-45'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Datanascimento)-1)+Case When Extract(Month From F.Datanascimento) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Datanascimento) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Datanascimento) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 50 Then '46-50'
          When (Extract(Year From Sdt.Datafiltro)-Extract(Year From F.Datanascimento)-1)+Case When Extract(Month From F.Datanascimento) > Extract(Month From Sdt.Datafiltro) Then 0 When Extract(Month From F.Datanascimento) < Extract(Month From Sdt.Datafiltro) Then 1 Else Case When Extract(Day From F.Datanascimento) > Extract(Day From Sdt.Datafiltro) Then 0 Else 1 End End <= 60 Then '51-60'
          Else '61 p/ cima'
        End As FaixaEtaria,
        Coalesce(ME.nome,'-') MotivoEstab,
        Fimestab Estabilidade,
        Case F.Tiposalario When 1 Then 'Normal' When 2 Then 'Especial' When 3 Then 'Variável' Else '...' End TiposalarioAtual, 
        Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End Salarioatual,
        'R$' || lpad(Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End,5,0) SalAtual,
        Case 
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End = 0 Then 'Variável'
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End <= Salmin.Valor Then '01 - 0,01 até ' || Salmin.Valor
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End Between (Salmin.Valor)   And (Salmin.Valor*2) Then '02 - Entre ' || Salmin.Valor   || ' e '  || Salmin.Valor*2
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End Between (Salmin.Valor*2) And (Salmin.Valor*3) Then '03 - Entre ' || Salmin.Valor*2 || ' e '  || Salmin.Valor*3
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End Between (Salmin.Valor*3) And (Salmin.Valor*4) Then '04 - Entre ' || Salmin.Valor*3 || ' e '  || Salmin.Valor*4
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End Between (Salmin.Valor*4) And (Salmin.Valor*5) Then '05 - Entre ' || Salmin.Valor*4 || ' e '  || Salmin.Valor*5
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End Between (Salmin.Valor*5) And (Salmin.Valor*6) Then '06 - Entre ' || Salmin.Valor*5 || ' e '  || Salmin.Valor*6
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End Between (Salmin.Valor*6) And (Salmin.Valor*7) Then '07 - Entre ' || Salmin.Valor*6 || ' e '  || Salmin.Valor*7
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End Between (Salmin.Valor*7) And (Salmin.Valor*8) Then '08 - Entre ' || Salmin.Valor*7 || ' e '  || Salmin.Valor*8
          When Case When F.Tiposalario = 2 Then F.Salarioatual Else Cs.Salario End Between (Salmin.Valor*8) And (Salmin.Valor*9) Then '09 - Entre ' || Salmin.Valor*8 || ' e '  || Salmin.Valor*9
          Else '10 - Maior que '  || Salmin.Valor*9
        End As FaixaSalarioAtual,
        to_char(sind.databasesindicato,'MM') SindDataBase,
        sind.nome || ' - ' || sind.codigo As Sindicato,
        sind.CGC As SindCNPJ,
        sind.k_minimovariavel As GarantSindVariável,
        sind.salarionormativo As SalNormativo,
        lpad(extract(month from fs.inicio),2,0) || '/' || lpad(extract(year from fs.inicio),4,0) As InicioSal,
        Case Fs.Tiposalario When 1 Then 'Normal' When 2 Then 'Especial' When 3 Then 'Variável' Else '...' End Tiposalario, 
        Coalesce(Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End,0) Salario,
        'R$' || lpad(Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End,5,0) Sal,
        Case 
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End = 0 Then 'Variável'
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End <= Salmin.Valor Then '01 - 0,01 até ' || Salmin.Valor
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End Between (Salmin.Valor)   And (Salmin.Valor*2) Then '02 - Entre ' || Salmin.Valor   || ' e '  || Salmin.Valor*2
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End Between (Salmin.Valor*2) And (Salmin.Valor*3) Then '03 - Entre ' || Salmin.Valor*2 || ' e '  || Salmin.Valor*3
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End Between (Salmin.Valor*3) And (Salmin.Valor*4) Then '04 - Entre ' || Salmin.Valor*3 || ' e '  || Salmin.Valor*4
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End Between (Salmin.Valor*4) And (Salmin.Valor*5) Then '05 - Entre ' || Salmin.Valor*4 || ' e '  || Salmin.Valor*5
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End Between (Salmin.Valor*5) And (Salmin.Valor*6) Then '06 - Entre ' || Salmin.Valor*5 || ' e '  || Salmin.Valor*6
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End Between (Salmin.Valor*6) And (Salmin.Valor*7) Then '07 - Entre ' || Salmin.Valor*6 || ' e '  || Salmin.Valor*7
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End Between (Salmin.Valor*7) And (Salmin.Valor*8) Then '08 - Entre ' || Salmin.Valor*7 || ' e '  || Salmin.Valor*8
          When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End Between (Salmin.Valor*8) And (Salmin.Valor*9) Then '09 - Entre ' || Salmin.Valor*8 || ' e '  || Salmin.Valor*9
          Else '10 - Maior que '  || Salmin.Valor*9
        End As FaixaSalario,
        Case When Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End = 0 then 0 else case when fs.percentual < -10000 then 0 else fs.percentual end End Reajuste,
        lpad(extract(year from fs.inicio),4,0) || '/' || lpad(extract(month from fs.inicio),2,0) UltAlteracao,
        (coalesce((Select coalesce(insalubridade,0) from fp_percconddiferenciadas PercDif where ((PercDif.Funcionario = F.Handle) And (Sdt.Datafiltro Between PercDif.Inicio And Coalesce(PercDif.Fim,Sdt.Datafiltro)))),0)/100)*Salmin.Valor  Insalubridade,
        (coalesce((Select coalesce(Periculosidade,0) from fp_percconddiferenciadas PercDif where ((PercDif.Funcionario = F.Handle) And (Sdt.Datafiltro Between PercDif.Inicio And Coalesce(PercDif.Fim,Sdt.Datafiltro)))),0)/100)*Case When Fs.Tiposalario = 2 Then Fs.Salario Else FCs.Salario End Periculosidade,
        adiantamentosalarial || '%' AdtoSal,   
       Case when fp.FORMAPAGAMENTO = 1 And fp.TIPOPAGAMENTO = 3 then 'Cheque' when fp.FORMAPAGAMENTO = 1 then 'Depósito Bancário' else 'Pagamento em espécie' end As FormaPgto,
       Case when fp.FORMAPAGAMENTO = 1 And fp.TIPOPAGAMENTO = 3 then '-' when fp.FORMAPAGAMENTO = 1 then bc.nome else '-' end As Banco,
       Case when fp.FORMAPAGAMENTO = 1 And fp.TIPOPAGAMENTO = 3 then '-' when fp.FORMAPAGAMENTO = 1 then ba.codigo || '-' || ba.digito  else '-' end As Agencia,
        1 Qde,
        case when LENGTH(F.K_Emailempresa) > 20 then 1 else 0 end Qdeemail,
        (Select count(td.handle) from do_funcionariodependentes d inner join TA_TIPOSDEPENDENTES TD on td.handle = d.tipo Where td.handle = 1 And d.funcionario = f.handle) As Filhos,
        case when (f.DEFICIENCIA = 1) then 'Sim' else '-' end PCD,
        case when (f.DEFICIENCIA = 1) then 1 else 0 end QdePCD,
        case
          when (f.DEFICIENCIA = 1) then
            CASE F.TIPODEFICIENCIA
              WHEN 1 THEN 'Física'
              WHEN 2 THEN 'Auditivo'
              WHEN 3 THEN 'Visual'
              WHEN 4 THEN 'Intelectual'
              WHEN 5 THEN 'Múltipla'
              WHEN 6 THEN 'Reabilitado'
              ELSE 'TEM BOI NA LINHA'
          END
        else '-'
        end TIPODEFICIENCIA
     From
        Do_Funcionarios F
        inner Join (Select To_Date(:Data,'dd/mm/yyyy') As Datafiltro From Adm_Empresas Dt Where (Dt.Handle = 100)) Sdt On  1=1
        Inner Join Ta_Situacoes S On S.Handle = F.Situacao
        Inner Join Do_Funcionariocargos Fc On ((Fc.Funcionario = F.Handle) And (Sdt.Datafiltro Between Fc.Inicio And Coalesce(Fc.Fim,Sdt.Datafiltro)))
        Inner Join Cs_Cargos C On Fc.Cargo = C.Handle
        Inner Join Cs_Classesteps Cs On (Cs.Handle = F.Step)
        Inner Join Cs_Classes Cl On (Cl.Handle = Cs.Classe)
        Inner Join Fp_Funcionariopagamento Fp On Fp.Funcionario = F.Handle
        left  Join FP_funcionariosindicatos Fsind On ((Fsind.Funcionario = F.Handle) And (Sdt.Datafiltro Between Fsind.Inicio And Coalesce(Fsind.Fim,Sdt.Datafiltro)))
        left  join fp_sindicatos sind On (Sind.handle = fsind.sindicato)
        left  Join do_funcionariosalarios Fs On ((Fs.Funcionario = F.Handle) And (Sdt.Datafiltro Between Fs.Inicio And Coalesce(Fs.Fim,Sdt.Datafiltro)))
        left  Join Cs_Classesteps FCs On (FCs.Handle = Fs.Step)
        Inner Join Fp_Funcionariocentroscusto Fcc On ((Fcc.Funcionario = Fp.Handle) And (Sdt.Datafiltro Between Fcc.Inicio And Coalesce(Fcc.Fim,Sdt.Datafiltro)))
        Inner Join Fp_Centroscustos Cc On Cc.Handle = Fcc.Centrocusto
        Inner Join Do_Funcionariohierarquias Fh On ((Fh.Funcionario = F.Handle) And (Sdt.Datafiltro Between Fh.Inicio And Coalesce(Fh.Fim,Sdt.Datafiltro)))
        Inner Join Adm_Hierarquias H On H.Handle = Fh.Hierarquia
        Inner Join Do_Funcionariounidades Fu On ((Fu.Funcionario = F.Handle) And (Sdt.Datafiltro Between Fu.Inicio And Coalesce(Fu.Fim,Sdt.Datafiltro)))
        Inner Join Adm_Unidades U On U.Handle = Fu.Unidadeanterior
        Inner Join Adm_Empresas EM On EM.Handle = u.Empresa
        Inner Join Ta_Estadoscivis Ec On(Ec.Handle = F.Estadocivil)
        Inner Join TA_NIVEISESCOLARIDADE NE On NE.handle = f.nivelescolaridade  
        Inner join 
          (Select cv2.valor from Fp_Constantevalores Cv2 Inner join
            (Select Max(Cv.Vigencia) Vigencia From Fp_Constantevalores Cv
            Where Cv.Constante = 100) Scv On scv.vigencia = cv2.vigencia And Cv2.Constante = 100) SalMin On 1=1
        Left Join 
          (Select S1.Funcionario, S1.FimEstab, Max(Fest2.Motivo) Motivo From Do_Funcionarioestabilidades Fest2
          Inner Join (Select Fest.Funcionario, Max(Fest.Fim) Fimestab From Do_Funcionarioestabilidades Fest Group By Fest.Funcionario) S1 On S1.Funcionario = Fest2.Funcionario And S1.Fimestab = Fest2.Fim
          Group By S1.Funcionario, S1.Fimestab) Estab On Estab.Funcionario = F.Handle and Sdt.Datafiltro < Estab.FimEstab
        Left join ta_estabilidademotivos ME On ME.handle = Estab.motivo
        left join TA_BANCOS bc on bc.handle = fp.banco
        left join TA_BANCOAGENCIAS ba on ba.handle = fp.agencia  
        Left Join  K_CS_ALOCACOES A on a.handle = c.K_ALOCACAO            
        Left join Benner_corp.ct_cc CCC          On (CCC.empresa = cc.empresa And CCC.codigo  = cc.codigo)
        Left join (Select CCG.CODIGO, ccgcc.centrocustos, ccg.estrutura || '-' || ccg.nome CCGerencial, CCG.tipo
                   from Benner_corp.CT_CCGERENCIALCC CCGCC
                   Inner join Benner_corp.CT_CCGERENCIAIS CCG
                     On CCG.handle = ccgcc.CENTROCUSTOGERENCIAL
                  ) SCC on SCC.centrocustos = ccc.handle And ((SCC.tipo = 1 and cc.empresa = 100) or (Not cc.empresa = 100))
     Where 1=1
--        And f.tipocolaborador =1        
        And U.Ativa = 'S'
        And U.Empresa In (Select E.Handle From Adm_Empresas E Where E.Emprativa = 'S')
    )    
Order By
  Unidade,
  Funcionario 









































  SELECT
   CAST(CON.T214DATAHORA AS DATE) DATACONS,
   CON.T214IDCONSULTA IDENTIFICADOR,
   CON.T214CLIENTE DOCCLIENTE,
   CLI.T017NOME NOMECLIENTE,
   SRV.T211DESCRICAO SERVICO,
   SPC.T210NOME PRESTADORA,
   DECODE(CON.T214RESTRICAO,'S','Sim','N','Não') RESTRICAO,
   CON.T214LOJA LOJA,
   CON.T214USUARIO,
   USU.T003NOME,
   REG.T003NOME REGIONAL,
   EXTRACT(MONTH FROM CAST(CON.T214DATAHORA AS DATE)) MESCONS,
   EXTRACT(YEAR FROM CAST(CON.T214DATAHORA AS DATE)) ANOCONS,
   IIF(CON.T214LOJA > 0, 'Loja', 'Mesa') ORIGEMCONSULTA,
   IIF(CON.T214LOJA > 0, 1, 0) QTD_CONSULTA_LOJA,
   IIF(CON.T214LOJA = 0, 1, 0) QTD_CONSULTA_MATRIZ
FROM T214SPCCONSULTAS CON
INNER JOIN T017CLIENTES CLI ON (CLI.T017DOC = CON.T214CLIENTE)
INNER JOIN T211SPCSERVICO SRV ON (SRV.T211IDSERVICO = CON.T214IDSERVICO)
INNER JOIN T210SPCPRESTADOR SPC ON (SPC.T210IDPREST = SRV.T211IDPREST)
INNER JOIN T021UNIDADES LOJ ON (LOJ.T021CODUND = CON.T214LOJA)
INNER JOIN T003USUARIOS REG ON (REG.T003IDUSER = LOJ.T021REGIONAL)
INNER JOIN T003USUARIOS USU ON (CON.T214USUARIO = USU.T003IDUSER)
WHERE CAST(CON.T214DATAHORA AS DATE) BETWEEN :"Data Inicial" AND :"Data Final"
AND CHAR_LENGTH(CON.T214PROTOCOLO) > 5
AND SRV.T211IDPREST IN (1,2)





SELECT IDPREST, PRESTADORA, TIPO, ORDEM, TOTCUSTO, QTD,
    CAST (CASE WHEN TIPO = 2 THEN SUM(TOTCUSTO) ELSE 0 END AS DOUBLE PRECISION) TOTCUSTOGERAL,
    CAST (CASE WHEN TIPO = 2 THEN SUM(QTD) ELSE 0 END AS DOUBLE PRECISION) QTDGERAL
FROM
(
SELECT
   IDPREST,
   PRESTADORA,
   TIPO,
   ORDEM,
   SUM(CAST(TOTCUSTO AS NUMERIC(15,2))) TOTCUSTO,
   SUM(CAST(QTD AS INTEGER))QTD
FROM
(
   SELECT
      P.T210IDPREST IDPREST,
      '  • ' || P.T210NOME PRESTADORA,
      CAST ('01.01.2015' AS DATE) DATAREG,
      0 TOTCUSTO,
      0 QTD,
      0 ORDEM,
      0 TIPO
   FROM T210SPCPRESTADOR P

   UNION

   SELECT
      P.T210IDPREST IDPREST,
      '      - ' || S.T211DESCRICAO PRESTADORA,
      CAST(C.T214DATAHORA AS DATE) DATAREG,
      SUM(C.T214CUSTO) TOTCUSTO,
      CAST(COUNT(*) AS INTEGER) QTD,
      1 ORDEM,
      1 TIPO
   FROM T214SPCCONSULTAS C
   INNER JOIN T211SPCSERVICO S ON C.T214IDSERVICO = S.T211IDSERVICO
   INNER JOIN T210SPCPRESTADOR P ON S.T211IDPREST = P.T210IDPREST
   WHERE CHAR_LENGTH(C.T214PROTOCOLO) > 5
   GROUP BY 1,2,3

   UNION

   SELECT
      P.T210IDPREST IDPREST,
      '      - '||'Negativações' PRESTADORA,
      CAST(L.T218DATAHORARET AS DATE) DATAREG,
      SUM(N.T219CUSTOREG) TOTCUSTO,
      CAST(COUNT(*) AS INTEGER) QTD,
      2 ORDEM,
      1 TIPO
   FROM T218SPCLOTEMOV L
   INNER JOIN T219SPCLOTENEGITENS N ON L.T218IDLOTE = N.T219IDLOTE
   INNER JOIN T210SPCPRESTADOR P ON L.T218PRESTADORA = P.T210IDPREST
   WHERE L.T218TIPOMOV = 'I' AND N.T219CODRETORNO = 0 AND N.T219IDLOTE <> 1
   AND L.T218IDLOTE > 5
   GROUP BY 1,2,3

   UNION

   SELECT
         IDPREST,
         '  • ' ||'TOTAL' PRESTADORA,
         DATAREG,
         (TOTCUSTO),
         (QTD),
         1 ORDEM,
         2 TIPO
   FROM
   (
      SELECT
         P.T210IDPREST IDPREST,
         '  • ' || 'Total' PRESTADORA,
         CAST(C.T214DATAHORA AS DATE) DATAREG,
         SUM(C.T214CUSTO) TOTCUSTO,
         CAST(COUNT(*) AS INTEGER) QTD,
         1 ORDEM,
         2 TIPO
      FROM T214SPCCONSULTAS C
      INNER JOIN T211SPCSERVICO S ON C.T214IDSERVICO = S.T211IDSERVICO
      INNER JOIN T210SPCPRESTADOR P ON S.T211IDPREST = P.T210IDPREST
      WHERE CHAR_LENGTH(C.T214PROTOCOLO) > 5
      GROUP BY 1,2,3
   
   UNION
   
      SELECT
         P.T210IDPREST IDPREST,
         'Negativações' PRESTADORA,
         CAST(L.T218DATAHORARET AS DATE) DATAREG,
         SUM(N.T219CUSTOREG) TOTCUSTO1,
         CAST(COUNT(*) AS INTEGER) QTD,
         2 ORDEM,
         1 TIPO
      FROM T218SPCLOTEMOV L
      INNER JOIN T219SPCLOTENEGITENS N ON L.T218IDLOTE = N.T219IDLOTE
      INNER JOIN T210SPCPRESTADOR P ON L.T218PRESTADORA = P.T210IDPREST
      WHERE L.T218TIPOMOV = 'I' AND N.T219CODRETORNO = 0 AND N.T219IDLOTE <> 1
      AND L.T218IDLOTE > 5
      GROUP BY 1,2,3

   )

) WHERE (DATAREG BETWEEN :INICIO AND :FIM) OR (TIPO = 0)


GROUP BY 1,2,3,4
ORDER BY IDPREST, TIPO, ORDEM)
GROUP BY 1,2,3,4,5,6
