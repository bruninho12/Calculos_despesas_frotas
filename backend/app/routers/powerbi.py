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
        # Se o template não existir, criar um arquivo de instruções como alternativa
        instructions_path = os.path.join(TEMPLATE_DIR, "README.txt")
        if os.path.exists(instructions_path):
            return FileResponse(
                path=instructions_path,
                filename="Instruções_Template_PowerBI.txt",
                media_type="text/plain"
            )
        else:
            # Se nem mesmo o arquivo de instruções existir, retornar um erro mais amigável
            return StreamingResponse(
                io.StringIO("Este é um arquivo de instruções temporário para o Power BI.\n\n"
                           "Para criar um template real do Power BI:\n"
                           "1. Abra o Power BI Desktop\n"
                           "2. Crie seu relatório usando dados de exemplo\n"
                           "3. Salve como template (.pbit)\n"
                           "4. Coloque o arquivo na pasta backend/app/static/templates/\n"),
                media_type="text/plain",
                headers={"Content-Disposition": f'attachment; filename="Instruções_Template_PowerBI.txt"'}
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
    instructions_path = os.path.join(TEMPLATE_DIR, "README.txt")
    
    if not os.path.exists(excel_path):
        raise HTTPException(
            status_code=404, 
            detail=f"Planilha Excel não encontrada: {filename}"
        )
    
    # Criar um arquivo ZIP em memória
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Adicionar a planilha Excel
        zip_file.write(excel_path, arcname=f"planilha_{filename}")
        
        # Adicionar o template Power BI ou o arquivo de instruções
        if os.path.exists(template_path):
            zip_file.write(template_path, arcname="Análise_Frotas_Template.pbit")
        elif os.path.exists(instructions_path):
            zip_file.write(instructions_path, arcname="Instruções_Template_PowerBI.txt")
        else:
            # Se nenhum arquivo existir, criar um arquivo de instruções em memória
            instructions_content = ("Este é um arquivo de instruções temporário para o Power BI.\n\n"
                                    "Para criar um template real do Power BI:\n"
                                    "1. Abra o Power BI Desktop\n"
                                    "2. Crie seu relatório usando dados de exemplo\n"
                                    "3. Salve como template (.pbit)\n"
                                    "4. Coloque o arquivo na pasta backend/app/static/templates/\n")
            
            # Adicionar o arquivo de instruções ao ZIP
            zip_file.writestr("Instruções_Template_PowerBI.txt", instructions_content)
    
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