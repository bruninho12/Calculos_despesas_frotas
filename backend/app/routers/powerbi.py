import io
import zipfile
import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, StreamingResponse

# Definir o diretório para templates
TEMPLATE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "templates")

router = APIRouter()

@router.get("/template-powerbi/")
async def download_power_bi_template():
    """
    Download do template Power BI para análise de dados de frota.
    """
    template_path = os.path.join(TEMPLATE_DIR, "frotas_template.pbit")
    
    if not os.path.exists(template_path):
        raise HTTPException(
            status_code=404, 
            detail="Template Power BI não encontrado. Entre em contato com o administrador."
        )
    
    return FileResponse(
        path=template_path,
        filename="Análise_Frotas_Template.pbit",
        media_type="application/octet-stream"
    )

@router.get("/download-zip/{filename}")
async def download_zip(filename: str):
    """
    Download de um arquivo ZIP contendo a planilha Excel e o template Power BI.
    """
    # Verificar se o arquivo Excel existe no diretório de uploads
    excel_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), 
        "data", "uploads", filename
    )
    
    # Verificar se o arquivo Power BI template existe
    template_path = os.path.join(TEMPLATE_DIR, "frotas_template.pbit")
    
    if not os.path.exists(excel_path):
        raise HTTPException(
            status_code=404, 
            detail=f"Planilha Excel não encontrada: {filename}"
        )
    
    if not os.path.exists(template_path):
        raise HTTPException(
            status_code=404, 
            detail="Template Power BI não encontrado. Entre em contato com o administrador."
        )
    
    # Criar um arquivo ZIP em memória
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Adicionar a planilha Excel
        zip_file.write(excel_path, arcname=f"planilha_{filename}")
        
        # Adicionar o template Power BI
        zip_file.write(template_path, arcname="Análise_Frotas_Template.pbit")
    
    # Preparar o buffer para leitura
    zip_buffer.seek(0)
    
    # Retornar o arquivo ZIP
    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="Análise_Frotas_Completa.zip"'}
    )

@router.get("/download-latest-with-template/")
async def download_latest_with_template():
    """
    Download do template Power BI junto com a planilha Excel mais recente processada.
    """
    # Encontrar o arquivo Excel mais recente no diretório de uploads
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "uploads")
    
    # Verificar se o diretório existe
    if not os.path.exists(data_dir):
        raise HTTPException(
            status_code=404, 
            detail="Diretório de uploads não encontrado."
        )
    
    # Listar todos os arquivos Excel no diretório
    excel_files = [f for f in os.listdir(data_dir) if f.endswith(('.xlsx', '.xls'))]
    
    if not excel_files:
        raise HTTPException(
            status_code=404, 
            detail="Nenhuma planilha Excel encontrada no diretório de uploads."
        )
    
    # Ordenar por data de modificação (mais recente primeiro)
    excel_files.sort(key=lambda f: os.path.getmtime(os.path.join(data_dir, f)), reverse=True)
    
    # Pegar o arquivo mais recente
    latest_excel = excel_files[0]
    
    # Retornar usando a função de download ZIP
    return await download_zip(latest_excel)