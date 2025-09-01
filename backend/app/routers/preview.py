import pandas as pd
import json
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from typing import Dict, List, Any, Optional

router = APIRouter()

@router.post("/previa-dados/")
async def previa_dados(
    planilha_custos: Optional[UploadFile] = File(None),
    relacao_frotas: Optional[UploadFile] = File(None)
):
    """
    Fornece uma prévia dos dados das planilhas sem processá-los completamente.
    Retorna as primeiras linhas e informações sobre as colunas.
    """
    resultado = {"status": "success", "previa": {}}

    # Processar planilha de custos se fornecida
    if planilha_custos:
        try:
            # Validar tipo de arquivo
            if not planilha_custos.filename.endswith(('.xlsx', '.xls')):
                raise HTTPException(status_code=400, 
                                  detail=f"Arquivo {planilha_custos.filename} não é um Excel válido (.xlsx ou .xls).")
            
            # Ler o conteúdo do arquivo
            content = await planilha_custos.read()
            
            # Usar pandas para ler as primeiras linhas
            import io
            df = pd.read_excel(io.BytesIO(content))
            
            # Resetar o ponteiro do arquivo para uso posterior
            await planilha_custos.seek(0)
            
            # Obter informações sobre a planilha
            resultado["previa"]["custos"] = {
                "colunas": list(df.columns),
                "num_linhas": len(df),
                "primeiras_linhas": df.head(5).replace({float('nan'): None}).to_dict('records'),
                "estatisticas": {
                    "frotas_unicas": df["NUM_FROTA"].nunique() if "NUM_FROTA" in df.columns else 0,
                    "tipos_gastos": df["DSC_ITEMTABELA"].nunique() if "DSC_ITEMTABELA" in df.columns else 0,
                }
            }
        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": f"Erro ao analisar planilha de custos: {str(e)}"}
            )

    # Processar planilha de frotas se fornecida
    if relacao_frotas:
        try:
            # Validar tipo de arquivo
            if not relacao_frotas.filename.endswith(('.xlsx', '.xls')):
                raise HTTPException(status_code=400, 
                                  detail=f"Arquivo {relacao_frotas.filename} não é um Excel válido (.xlsx ou .xls).")
            
            # Ler o conteúdo do arquivo
            content = await relacao_frotas.read()
            
            # Usar pandas para ler as primeiras linhas
            import io
            df = pd.read_excel(io.BytesIO(content))
            
            # Resetar o ponteiro do arquivo para uso posterior
            await relacao_frotas.seek(0)
            
            # Obter informações sobre a planilha
            resultado["previa"]["frotas"] = {
                "colunas": list(df.columns),
                "num_linhas": len(df),
                "primeiras_linhas": df.head(5).replace({float('nan'): None}).to_dict('records'),
                "estatisticas": {
                    "frotas_unicas": df["NUM_FROTA"].nunique() if "NUM_FROTA" in df.columns else 0,
                    "marcas_unicas": df["DSC_MARCA"].nunique() if "DSC_MARCA" in df.columns else 0,
                    "tipos_veiculos": df["DSC_TIPO"].nunique() if "DSC_TIPO" in df.columns else 0
                }
            }
        except Exception as e:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": f"Erro ao analisar planilha de frotas: {str(e)}"}
            )
    
    # Verificar correspondência de frotas se ambas as planilhas foram fornecidas
    if planilha_custos and relacao_frotas and "frotas" in resultado["previa"] and "custos" in resultado["previa"]:
        custos_df = pd.DataFrame(resultado["previa"]["custos"]["primeiras_linhas"])
        frotas_df = pd.DataFrame(resultado["previa"]["frotas"]["primeiras_linhas"])
        
        # Verificar correspondências nas primeiras linhas
        if "NUM_FROTA" in custos_df.columns and "NUM_FROTA" in frotas_df.columns:
            frotas_custos = set(custos_df["NUM_FROTA"].dropna().astype(str).unique())
            frotas_cadastro = set(frotas_df["NUM_FROTA"].dropna().astype(str).unique())
            
            # Adicionar informações sobre correspondência
            resultado["previa"]["correspondencia"] = {
                "frotas_em_ambos": list(frotas_custos.intersection(frotas_cadastro)),
                "frotas_apenas_custos": list(frotas_custos - frotas_cadastro),
                "frotas_apenas_cadastro": list(frotas_cadastro - frotas_custos)
            }

    return resultado
