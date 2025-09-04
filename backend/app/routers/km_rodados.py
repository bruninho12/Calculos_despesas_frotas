import pandas as pd
import numpy as np
import io
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, List, Any, Optional

router = APIRouter()

@router.post("/teste-upload/")
async def teste_upload(
    planilha_km: Optional[UploadFile] = File(None),
    planilha_organizada: Optional[UploadFile] = File(None)
):
    """
    Teste simples para verificar se os arquivos estão sendo recebidos corretamente,
    sem processá-los com pandas.
    """
    resultado = {
        "status": "success",
        "arquivos_recebidos": {}
    }
    
    if planilha_km:
        resultado["arquivos_recebidos"]["planilha_km"] = {
            "filename": planilha_km.filename,
            "content_type": planilha_km.content_type,
            "size": 0  # Será atualizado abaixo
        }
        # Verificar tamanho do arquivo
        content = await planilha_km.read()
        resultado["arquivos_recebidos"]["planilha_km"]["size"] = len(content)
        await planilha_km.seek(0)  # Reset para uso posterior
    
    if planilha_organizada:
        resultado["arquivos_recebidos"]["planilha_organizada"] = {
            "filename": planilha_organizada.filename,
            "content_type": planilha_organizada.content_type,
            "size": 0  # Será atualizado abaixo
        }
        # Verificar tamanho do arquivo
        content = await planilha_organizada.read()
        resultado["arquivos_recebidos"]["planilha_organizada"]["size"] = len(content)
        await planilha_organizada.seek(0)  # Reset para uso posterior
    
    return resultado

@router.post("/previa-km/")
async def previa_km_rodados(
    planilha_km: Optional[UploadFile] = File(None),
    planilha_organizada: Optional[UploadFile] = File(None)
):
    """
    Fornece uma prévia dos dados da planilha de KM rodados e da planilha organizada.
    """
    import io as python_io  # Renomeando para evitar conflitos
    import pandas as pd
    import traceback
    
    resultado = {"status": "success", "previa": {}}

    try:
        # Processar planilha de KM se fornecida
        if planilha_km:
            try:
                # Validar tipo de arquivo
                if not planilha_km.filename.endswith(('.xlsx', '.xls')):
                    raise HTTPException(status_code=400, 
                                      detail=f"Arquivo {planilha_km.filename} não é um Excel válido (.xlsx ou .xls).")
                
                # Ler o conteúdo do arquivo
                content = await planilha_km.read()
                
                print(f"Lendo planilha KM: {planilha_km.filename}")
                
                # Usar pandas para ler as primeiras linhas
                km_df = pd.read_excel(python_io.BytesIO(content))
                print(f"Leitura bem-sucedida, colunas: {list(km_df.columns)}")
                
                # Resetar o ponteiro do arquivo para uso posterior
                await planilha_km.seek(0)
                
                # Verificar se temos as colunas necessárias para cálculos
                colunas_necessarias = ["NUM_FROTA", "KM_ATUAL", "DTA_MOVIMENTO"]
                colunas_faltantes = [col for col in colunas_necessarias if col not in km_df.columns]
                
                estatisticas = {
                    "registros_total": len(km_df),
                    "frotas_unicas": km_df["NUM_FROTA"].nunique() if "NUM_FROTA" in km_df.columns else 0,
                }
                
                # Adicionar estatísticas extras
                if "KM_ATUAL" in km_df.columns:
                    estatisticas["km_max"] = km_df["KM_ATUAL"].max()
                    estatisticas["km_min"] = km_df["KM_ATUAL"].min()
                
                if "QTDE_ITEM" in km_df.columns and "DSC_TIPO_DESPESAS" in km_df.columns:
                    # Contar quantos registros são de combustível
                    termos_combustivel = ["combustível", "combustivel", "diesel", "gasolina", "etanol", "alcool", "álcool"]
                    filtro_combustivel = km_df["DSC_TIPO_DESPESAS"].str.lower().str.contains('|'.join(termos_combustivel), na=False)
                    combustivel_df = km_df[filtro_combustivel]
                    
                    if not combustivel_df.empty:
                        estatisticas["registros_combustivel"] = len(combustivel_df)
                        estatisticas["litros_total"] = combustivel_df["QTDE_ITEM"].sum()
                
                # Adicionar mensagem explicativa
                if not colunas_faltantes:
                    estatisticas["mensagem"] = "Dados válidos. Será calculado: Km Rodados Mês (KM_MAX - KM_MIN), Qtd Litros Consumidos (soma de abastecimentos), Custo/Km e Média de Consumo."
                else:
                    estatisticas["aviso"] = f"Colunas obrigatórias faltando: {', '.join(colunas_faltantes)}. Necessárias: {', '.join(colunas_necessarias)}"
                
                resultado["previa"]["km"] = {
                    "colunas": list(km_df.columns),
                    "num_linhas": len(km_df),
                    "primeiras_linhas": km_df.head(5).replace({float('nan'): None}).to_dict('records'),
                    "estatisticas": estatisticas
                }
            except Exception as e:
                print(f"Erro detalhado ao analisar planilha KM: {str(e)}")
                print(traceback.format_exc())
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": f"Erro ao analisar planilha de KM rodados: {str(e)}"}
                )

        # Processar planilha organizada se fornecida
        if planilha_organizada:
            try:
                # Validar tipo de arquivo
                if not planilha_organizada.filename.endswith(('.xlsx', '.xls')):
                    raise HTTPException(status_code=400, 
                                      detail=f"Arquivo {planilha_organizada.filename} não é um Excel válido (.xlsx ou .xls).")
                
                # Ler o conteúdo do arquivo
                content = await planilha_organizada.read()
                
                print(f"Lendo planilha organizada: {planilha_organizada.filename}")
                
                # Usar pandas para ler as primeiras linhas
                org_df = pd.read_excel(python_io.BytesIO(content))
                print(f"Leitura da planilha organizada bem-sucedida, colunas: {list(org_df.columns)}")
                    
                # Resetar o ponteiro do arquivo para uso posterior
                await planilha_organizada.seek(0)
                
                # Obter informações sobre a planilha
                resultado["previa"]["organizada"] = {
                    "colunas": list(org_df.columns),
                    "num_linhas": len(org_df),
                    "primeiras_linhas": org_df.head(5).replace({float('nan'): None}).to_dict('records'),
                    "estatisticas": {
                        "frotas_unicas": org_df["NUM_FROTA"].nunique() if "NUM_FROTA" in org_df.columns else 0,
                        "marcas_unicas": org_df["DSC_MARCA"].nunique() if "DSC_MARCA" in org_df.columns else 0,
                    }
                }
            except Exception as e:
                print(f"Erro detalhado ao analisar planilha organizada: {str(e)}")
                print(traceback.format_exc())
                return JSONResponse(
                    status_code=400,
                    content={"status": "error", "message": f"Erro ao analisar planilha organizada: {str(e)}"}
                )
        
        return resultado
    except Exception as e:
        print(f"Erro global na função previa_km_rodados: {str(e)}")
        print(traceback.format_exc())
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"Erro inesperado ao processar as planilhas: {str(e)}"}
        )

@router.post("/processar-km/")
async def processar_km_rodados(
    planilha_km: UploadFile = File(...),
    planilha_organizada: UploadFile = File(...),
    skip_validation: bool = False
):
    """
    Processa a planilha de KM rodados junto com a planilha organizada.
    Combina os dados de KM rodados com os dados da planilha organizada e calcula:
    - Km Rodados Mês (pela diferença entre KM_MAX e KM_MIN)
    - Qtd Litros Consumidos (soma dos abastecimentos)
    - Custo / Km Rodado (Total Despesas / Km Rodados)
    - Média Consumo (Km/L ou L/Hr) (Km Rodados / Qtd Litros Consumidos)
    """
    try:
        # Validar tipos de arquivo
        if not planilha_km.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, 
                               detail=f"Arquivo {planilha_km.filename} não é um Excel válido (.xlsx ou .xls).")
        
        if not planilha_organizada.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, 
                               detail=f"Arquivo {planilha_organizada.filename} não é um Excel válido (.xlsx ou .xls).")
        
        # Ler as planilhas
        km_content = await planilha_km.read()
        organizada_content = await planilha_organizada.read()
        
        # Resetar os ponteiros dos arquivos para uso posterior
        await planilha_km.seek(0)
        await planilha_organizada.seek(0)
        
        # Processar os dados usando pandas, preservando os decimais
        # Usando o modo padrão do pandas para leitura dos valores
        km_df = pd.read_excel(io.BytesIO(km_content))
        organizada_df = pd.read_excel(io.BytesIO(organizada_content))
        
        # Listar as colunas encontradas para debug
        colunas_encontradas = list(km_df.columns)
        print(f"Colunas encontradas na planilha KM: {colunas_encontradas}")
        
        # Verificar se as colunas necessárias existem
        colunas_necessarias = ["NUM_FROTA", "KM_ATUAL", "DTA_MOVIMENTO"]
        colunas_faltantes_necessarias = [col for col in colunas_necessarias if col not in km_df.columns]
        
        if colunas_faltantes_necessarias:
            mensagem_erro = f"Colunas obrigatórias não encontradas na planilha: {', '.join(colunas_faltantes_necessarias)}.\n"
            mensagem_erro += f"A planilha deve conter as colunas: {', '.join(colunas_necessarias)}.\n"
            mensagem_erro += f"Colunas encontradas: {', '.join(colunas_encontradas)}."
            raise HTTPException(status_code=400, detail=mensagem_erro)
        
        # Preparar dados para cálculos
        if "DTA_MOVIMENTO" in km_df.columns:
            # Converter a coluna de data para o tipo datetime
            km_df["DTA_MOVIMENTO"] = pd.to_datetime(km_df["DTA_MOVIMENTO"])
            
            # Extrair mês e ano para agrupar
            km_df["MES_ANO"] = km_df["DTA_MOVIMENTO"].dt.strftime('%m/%Y')
        else:
            # Se não houver coluna de data, agrupar tudo como um único período
            km_df["MES_ANO"] = "Total"

        # Verificar se a coluna de identificação de frotas existe
        coluna_frota_km = "NUM_FROTA"  # Assume que NUM_FROTA é a coluna da frota
            
        # Verificar se NUM_FROTA existe na planilha organizada
        if "NUM_FROTA" not in organizada_df.columns:
            colunas_org = list(organizada_df.columns)
            raise HTTPException(
                status_code=400, 
                detail=f"Coluna 'NUM_FROTA' não encontrada na planilha organizada. Colunas encontradas: {', '.join(colunas_org)}"
            )
        
        # Convertendo colunas para strings para garantir correspondência correta
        km_df["NUM_FROTA"] = km_df["NUM_FROTA"].astype(str)
        organizada_df["NUM_FROTA"] = organizada_df["NUM_FROTA"].astype(str)
        
        # Garantir que KM_ATUAL seja numérico
        km_df["KM_ATUAL"] = pd.to_numeric(km_df["KM_ATUAL"], errors="coerce")

        # CÁLCULO 1: Km Rodados por Mês (KM_MAX - KM_MIN)
        # Função para detectar anomalias em uma série de KMs
        def detectar_anomalias(kms, datas):
            # Converter para array numpy para cálculos
            kms = pd.to_numeric(kms, errors='coerce').values
            datas = pd.to_datetime(datas).values
            
            # Calcular diferenças entre registros consecutivos
            km_diffs = np.diff(kms)
            dias_diffs = np.diff(datas).astype('timedelta64[D]').astype(int)
            
            # Calcular média diária para cada intervalo
            km_por_dia = np.where(dias_diffs > 0, km_diffs / dias_diffs, 0)
            
            # Identificar valores atípicos (mais de 1000km por dia ou negativos)
            anomalias = (km_por_dia > 1000) | (km_por_dia < 0)
            return anomalias

        # Primeiro, remover valores obviamente incorretos e criar cópia do DataFrame
        km_df = km_df[
            (km_df["KM_ATUAL"] > 0) &  # Remove zeros
            (km_df["KM_ATUAL"] < 9999999)  # Remove valores absurdos
        ].copy()
        
        # Converter DTA_MOVIMENTO para datetime se ainda não for
        km_df["DTA_MOVIMENTO"] = pd.to_datetime(km_df["DTA_MOVIMENTO"])
        
        # Ordenar por frota, data e km para análise sequencial
        km_df = km_df.sort_values(['NUM_FROTA', 'DTA_MOVIMENTO', 'KM_ATUAL'])
        
        # Preparar DataFrame para cálculo mensal
        km_mensal_list = []
        
        # Processar cada frota separadamente
        for frota, grupo_frota in km_df.groupby('NUM_FROTA'):
            # Processar cada mês separadamente
            for mes_ano, grupo_mes in grupo_frota.groupby('MES_ANO'):
                if len(grupo_mes) >= 2:  # Só calcula se tiver pelo menos 2 registros
                    # Ordenar registros por data
                    registros_ordenados = grupo_mes.sort_values(['DTA_MOVIMENTO', 'KM_ATUAL'])
                    
                    # Verificar se há anomalias na sequência de KMs
                    anomalias = detectar_anomalias(
                        registros_ordenados['KM_ATUAL'],
                        registros_ordenados['DTA_MOVIMENTO']
                    )
                    
                    if not any(anomalias):  # Se não houver anomalias
                        # Pegar o primeiro e último registro válido do mês
                        km_inicial = registros_ordenados.iloc[0]['KM_ATUAL']
                        km_final = registros_ordenados.iloc[-1]['KM_ATUAL']
                        
                        # Calcular a diferença
                        km_rodados = km_final - km_inicial
                        
                        # Validações adicionais
                        dias_no_mes = (registros_ordenados['DTA_MOVIMENTO'].max() - 
                                     registros_ordenados['DTA_MOVIMENTO'].min()).days
                        
                        media_diaria = km_rodados / max(dias_no_mes, 1)
                        
                        # Aplicar regras de validação
                        km_valido = (
                            km_rodados >= 0 and  # Não pode ser negativo
                            km_rodados <= 15000 and  # Limite máximo mensal razoável
                            media_diaria <= 500 and  # Média diária razoável
                            dias_no_mes <= 31  # Não pode ter mais que um mês de diferença
                        )
                        
                        if not km_valido:
                            # Se não passar nas validações, registrar como 0
                            km_rodados = 0
                    else:
                        # Se houver anomalias, tentar calcular usando registros válidos
                        registros_validos = registros_ordenados[~np.append(anomalias, False)]
                        if len(registros_validos) >= 2:
                            km_inicial = registros_validos.iloc[0]['KM_ATUAL']
                            km_final = registros_validos.iloc[-1]['KM_ATUAL']
                            km_rodados = km_final - km_inicial
                            
                            # Aplicar as mesmas validações
                            dias_no_mes = (registros_validos['DTA_MOVIMENTO'].max() - 
                                         registros_validos['DTA_MOVIMENTO'].min()).days
                            media_diaria = km_rodados / max(dias_no_mes, 1)
                            
                            if not (0 <= km_rodados <= 15000 and media_diaria <= 500):
                                km_rodados = 0
                        else:
                            km_rodados = 0
                    
                    km_mensal_list.append({
                        'NUM_FROTA': frota,
                        'MES_ANO': mes_ano,
                        'Km Rodados Mês': km_rodados,
                        'Registros': len(grupo_mes),
                        'Primeira_Data': registros_ordenados['DTA_MOVIMENTO'].iloc[0],
                        'Ultima_Data': registros_ordenados['DTA_MOVIMENTO'].iloc[-1]
                    })
                else:
                    # Se só tem um registro no mês, não é possível calcular km rodado
                    km_mensal_list.append({
                        'NUM_FROTA': frota,
                        'MES_ANO': mes_ano,
                        'Km Rodados Mês': 0,
                        'Registros': len(grupo_mes),
                        'Primeira_Data': grupo_mes['DTA_MOVIMENTO'].iloc[0] if len(grupo_mes) > 0 else None,
                        'Ultima_Data': grupo_mes['DTA_MOVIMENTO'].iloc[-1] if len(grupo_mes) > 0 else None
                    })
        
        # Criar DataFrame com os resultados
        km_mensal = pd.DataFrame(km_mensal_list)
        # Organizar por NUM_FROTA e MES_ANO
        km_mensal = km_mensal.sort_values(["NUM_FROTA", "MES_ANO"]).reset_index(drop=True)
        
        # CÁLCULO 2: Quantidade de Litros Consumidos
        # Filtrar apenas lançamentos de combustível
        combustivel_df = None
        if "DSC_TIPO_DESPESAS" in km_df.columns:
            # Filtrar por tipo de despesa relacionada a combustível
            termos_combustivel = ["combustível", "combustivel", "diesel", "gasolina", "etanol", "alcool", "álcool"]
            filtro_combustivel = km_df["DSC_TIPO_DESPESAS"].str.lower().str.contains('|'.join(termos_combustivel), na=False)
            combustivel_df = km_df[filtro_combustivel]
        else:
            combustivel_df = km_df  # Se não tiver coluna de tipo, usar todos os registros
            
        # Agrupar por Frota e Mês, somar quantidade
        if "QTDE_ITEM" in combustivel_df.columns:
            litros_consumidos = combustivel_df.groupby(["NUM_FROTA", "MES_ANO"])["QTDE_ITEM"].sum().reset_index()
            litros_consumidos = litros_consumidos.rename(columns={"QTDE_ITEM": "Qtd Litros Consumidos"})
        else:
            # Se não existir a coluna, criar um DataFrame vazio com as colunas necessárias
            litros_consumidos = pd.DataFrame(columns=["NUM_FROTA", "MES_ANO", "Qtd Litros Consumidos"])
        
        # Juntar os dados calculados
        dados_km = pd.merge(
            km_mensal,
            litros_consumidos,
            on=["NUM_FROTA", "MES_ANO"],
            how="left"
        )
        
        # Obter despesas por frota e mês da planilha organizada
        # Primeiro verificar se temos Mês na planilha organizada
        if "Mês" not in organizada_df.columns:
            # Se não tivermos, consideramos que todos são do mesmo período
            organizada_df["Mês"] = "Total"
        
        # Criar nova coluna para Custo / Km Rodado
        dados_km["Custo / Km Rodado"] = 0.0
        
        # Para cada linha na tabela de KM, procurar o valor correspondente na planilha organizada
        for idx, row in dados_km.iterrows():
            frota = row["NUM_FROTA"]
            mes = row["MES_ANO"]

            # Procurar na planilha organizada
            filtro_frota = organizada_df["NUM_FROTA"] == frota

            # Verificar se temos correspondência exata de mês ou se usamos "Total"
            if mes == "Total" or "Mês" not in organizada_df.columns:
                filtro_mes = organizada_df["Mês"].notna()  # todas as linhas
            else:
                # Tentar encontrar correspondência exata, senão usar qualquer linha dessa frota
                filtro_mes = organizada_df["Mês"] == mes
                if not any(filtro_frota & filtro_mes):
                    filtro_mes = organizada_df["Mês"].notna()

            # Filtrar os dados
            despesas_frota = organizada_df[filtro_frota & filtro_mes]

            km_rodados = row["Km Rodados Mês"]
            # Só faz cálculo se km_rodados for numérico e maior que zero
            if (
                not despesas_frota.empty and
                "Total Despesas" in despesas_frota.columns and
                isinstance(km_rodados, (int, float)) and
                not pd.isna(km_rodados) and
                km_rodados > 0
            ):
                total_despesas = despesas_frota["Total Despesas"].sum()
                dados_km.at[idx, "Custo / Km Rodado"] = total_despesas / km_rodados
        
        # Calcular Média Consumo (Km/L)
        dados_km["Média Consumo (Km/L ou L/Hr)"] = 0.0
        for idx, row in dados_km.iterrows():
            km_rodados = row["Km Rodados Mês"]
            litros = row["Qtd Litros Consumidos"] if pd.notna(row["Qtd Litros Consumidos"]) else 0

            # Só faz cálculo se km_rodados for numérico e maior que zero
            if (
                isinstance(km_rodados, (int, float)) and
                not pd.isna(km_rodados) and
                km_rodados > 0 and
                litros > 0
            ):
                dados_km.at[idx, "Média Consumo (Km/L ou L/Hr)"] = km_rodados / litros
        
    # Remover colunas intermediárias usadas para cálculo (não há mais KM_MIN e KM_MAX)
    # dados_km = dados_km.drop(columns=["KM_MIN", "KM_MAX"])
        
        # Unir dados com a planilha organizada original
        # Primeiro criar uma chave única para juntar corretamente
        dados_km["CHAVE"] = dados_km["NUM_FROTA"] + "_" + dados_km["MES_ANO"]
        if "Mês" in organizada_df.columns:
            organizada_df["CHAVE"] = organizada_df["NUM_FROTA"] + "_" + organizada_df["Mês"]
        else:
            organizada_df["CHAVE"] = organizada_df["NUM_FROTA"] + "_Total"
        
        # Juntar os dados
        resultado_df = pd.merge(
            organizada_df,
            dados_km.drop(columns=["NUM_FROTA", "MES_ANO"]),  # Evitar colunas duplicadas
            on="CHAVE",
            how="left"
        )
        
        # Remover a chave temporária
        resultado_df = resultado_df.drop(columns=["CHAVE"])
        
        # IMPORTANTE: Preservar a precisão dos números sem arredondamento
        # A formatação visual será aplicada apenas na exibição do Excel
        colunas_numericas = ["Km Rodados Mês", "Qtd Litros Consumidos", "Custo / Km Rodado", "Média Consumo (Km/L ou L/Hr)"]
        for col in colunas_numericas:
            if col in resultado_df.columns:
                # Substituir NaN por valores em branco
                resultado_df[col] = resultado_df[col].fillna(0)
                
                # NÃO ARREDONDAR valores - isso era um problema anterior
                # Os formatos de exibição serão controlados apenas na planilha Excel
        
        # Gerar o arquivo Excel final
        output = io.BytesIO()
        
        # Configurar opções de formatação de números para manter os decimais
        # Isso é especialmente importante para 'Qtd Litros Consumidos'
        from openpyxl.styles import numbers
        
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            # Salvar os dados processados
            resultado_df.to_excel(writer, sheet_name='Dados Completos', index=False)
            
            # Aplicar formatação para preservar os decimais exatos
            workbook = writer.book
            worksheet = writer.sheets['Dados Completos']
            
            # Obter índice das colunas
            col_indices = {}
            for i, col_name in enumerate(resultado_df.columns):
                col_indices[col_name] = i + 1  # Excel começa em 1
                
            # Aplicar formato específico para cada coluna
            formatos = {
                "Km Rodados Mês": '#,##0',  # Sem decimais
                "Qtd Litros Consumidos": '#,##0.00',  # 2 casas decimais
                "Custo / Km Rodado": '#,##0.00',  # 2 casas decimais
                "Média Consumo (Km/L ou L/Hr)": '#,##0.00',  # 2 casas decimais
                "Total Despesas": '#,##0.00'  # 2 casas decimais
            }
            
            # Aplicar formatos para cada coluna
            for col_name, formato in formatos.items():
                if col_name in col_indices:
                    col_idx = col_indices[col_name]
                    for row in range(2, len(resultado_df) + 2):  # Começa na linha 2 (após o cabeçalho)
                        cell = worksheet.cell(row=row, column=col_idx)
                        cell.number_format = formato
            
            # Adicionar uma planilha com dados calculados resumidos
            if "NUM_FROTA" in resultado_df.columns and all(col in resultado_df.columns for col in colunas_numericas):
                # Filtrar apenas linhas com valores numéricos em "Km Rodados Mês" para o resumo
                df_resumo = resultado_df[pd.to_numeric(resultado_df["Km Rodados Mês"], errors="coerce").notna()].copy()
                # Criar um resumo por frota
                resumo_df = df_resumo.groupby("NUM_FROTA")[colunas_numericas].agg({
                    "Km Rodados Mês": "sum",
                    "Qtd Litros Consumidos": "sum",
                    "Custo / Km Rodado": "mean",
                    "Média Consumo (Km/L ou L/Hr)": "mean"
                }).reset_index()

                # Não arredondar nenhum valor para preservar a precisão exata dos números
                # Os formatos serão aplicados apenas na exibição do Excel

                # Adicionar coluna com total de despesas sem arredondar
                resumo_df["Total Despesas"] = resumo_df["Km Rodados Mês"] * resumo_df["Custo / Km Rodado"]

                # Salvar resumo
                resumo_df.to_excel(writer, sheet_name='Resumo por Frota', index=False)

                # Aplicar formatação para preservar os decimais exatos na planilha de resumo
                worksheet_resumo = writer.sheets['Resumo por Frota']

                # Obter índice das colunas no resumo
                col_resumo_indices = {}
                for i, col_name in enumerate(resumo_df.columns):
                    col_resumo_indices[col_name] = i + 1  # Excel começa em 1

                # Aplicar formatos para todas as colunas numéricas no resumo
                formatos_resumo = {
                    "Km Rodados Mês": '#,##0',  # Sem decimais
                    "Qtd Litros Consumidos": '#,##0.00',  # 2 casas decimais
                    "Custo / Km Rodado": '#,##0.00',  # 2 casas decimais
                    "Média Consumo (Km/L ou L/Hr)": '#,##0.00',  # 2 casas decimais
                    "Total Despesas": '#,##0.00'  # 2 casas decimais
                }

                # Aplicar formatos para cada coluna
                for col_name, formato in formatos_resumo.items():
                    if col_name in col_resumo_indices:
                        col_idx = col_resumo_indices[col_name]
                        for row in range(2, len(resumo_df) + 2):  # Começa na linha 2 (após o cabeçalho)
                            cell = worksheet_resumo.cell(row=row, column=col_idx)
                            cell.number_format = formato
        
        # Retornar o arquivo para download
        output.seek(0)
        
        # Criar o arquivo temporário para download
        from fastapi.responses import StreamingResponse
        import datetime
        
        filename = f"planilha_completa_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
        
        headers = {
            'Content-Disposition': f'attachment; filename="{filename}"'
        }
        
        return StreamingResponse(
            output, 
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers=headers
        )
        
    except HTTPException as e:
        raise e
    except Exception as e:
        import traceback
        erro_traceback = traceback.format_exc()
        print(f"ERRO NO PROCESSAMENTO: {str(e)}")
        print(erro_traceback)
        raise HTTPException(status_code=500, detail=f"Erro ao processar planilhas: {str(e)}")
