from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import shutil
import os
import subprocess
import logging
import time
from datetime import datetime
from .routers import preview, km_rodados, powerbi

app = FastAPI(title="API de Processamento de Planilhas de Frotas", 
             description="API para processamento de planilhas de custos e frotas",
             version="1.2.0")

# Incluir os routers
app.include_router(preview.router, tags=["Prévia"])
app.include_router(km_rodados.router, tags=["KM Rodados"])
app.include_router(powerbi.router, tags=["Power BI"])

# Configurar origens permitidas com base no ambiente (desenvolvimento vs. produção)
origins = ["http://localhost:3000", "http://localhost:3001"]

# Em produção, adicione seus domínios reais aqui
# Por exemplo: "https://seu-dominio.com", "https://app.seu-dominio.com"
import os
if os.environ.get("AMBIENTE") == "producao":
    # Em produção, use apenas domínios específicos
    production_domains = os.environ.get("ALLOWED_ORIGINS", "").split(",")
    if production_domains and production_domains[0]:
        origins.extend(production_domains)
else:
    # Em desenvolvimento, podemos ser mais permissivos
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração de diretórios
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
HISTORICO_DIR = os.path.join(DATA_DIR, "historico")
SCRIPTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scripts")

# Criar diretórios necessários
for dir_path in [UPLOAD_DIR, HISTORICO_DIR]:
    os.makedirs(dir_path, exist_ok=True)

# Configuração de logs
LOG_DIR = os.path.join(BASE_DIR, "logs")
os.makedirs(LOG_DIR, exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(LOG_DIR, "api.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("organiza_api")

# Em produção, montar os arquivos estáticos do frontend
import os
if os.environ.get("AMBIENTE") == "producao":
    # Caminho para os arquivos estáticos do frontend (build do React)
    static_dir = os.path.join(os.path.dirname(BASE_DIR), "frontend", "build")
    
    if os.path.exists(static_dir):
        # Montar os arquivos estáticos
        app.mount("/static", StaticFiles(directory=os.path.join(static_dir, "static")), name="static")
        
        # Servir o index.html para a rota raiz
        @app.get("/", response_class=HTMLResponse)
        async def serve_frontend_root():
            with open(os.path.join(static_dir, "index.html"), "r", encoding="utf-8") as f:
                return f.read()
        
        # Redirecionar outras rotas para o index.html (para funcionamento do roteamento do React)
        @app.get("/{path:path}", response_class=HTMLResponse)
        async def serve_frontend(path: str):
            # Se for uma rota da API, não interferir
            if path.startswith("api/") or path == "api":
                raise HTTPException(status_code=404, detail="API route not found")
                
            # Caso contrário, servir o index.html para suporte a rotas do React
            with open(os.path.join(static_dir, "index.html"), "r", encoding="utf-8") as f:
                return f.read()
    else:
        print(f"AVISO: Diretório do frontend não encontrado em {static_dir}")
        print("As rotas do frontend não serão servidas automaticamente.")

# Endpoint de teste para verificar se a API está funcionando
@app.get("/teste/")
async def teste():
    return {"mensagem": "API está funcionando!"}

# Endpoint simples para testar upload de um único arquivo
@app.post("/teste-upload/")
async def teste_upload(arquivo: UploadFile = File(...)):
    print(f"Arquivo recebido: {arquivo.filename}")
    return {"filename": arquivo.filename, "content_type": arquivo.content_type}

@app.post("/processar-planilhas/")
async def processar_planilhas(
    planilha_custos: UploadFile = File(description="Arquivo Excel com a planilha de custos"),
    relacao_frotas: UploadFile = File(description="Arquivo Excel com a relação de frotas")
):
    # Criar ID de processamento único
    processo_id = f"proc-{int(time.time())}"
    logger.info(f"[{processo_id}] Iniciando processamento de arquivos: {planilha_custos.filename}, {relacao_frotas.filename}")
    
    # Validar tipos de arquivo
    for arquivo in [planilha_custos, relacao_frotas]:
        if not arquivo.filename.endswith(('.xlsx', '.xls')):
            logger.error(f"[{processo_id}] Tipo de arquivo inválido: {arquivo.filename}")
            raise HTTPException(status_code=400, detail=f"Arquivo {arquivo.filename} não é um arquivo Excel válido (.xlsx ou .xls).")
    
    try:
        # Criar pastas organizadas por data
        hoje = datetime.now().strftime("%Y-%m-%d")
        processo_dir = os.path.join(UPLOAD_DIR, hoje, processo_id)
        os.makedirs(processo_dir, exist_ok=True)
        
        # Salvar arquivos temporariamente com nomes seguros
        custos_path = os.path.join(processo_dir, f"custos-{planilha_custos.filename}")
        frotas_path = os.path.join(processo_dir, f"frotas-{relacao_frotas.filename}")
        
        logger.info(f"[{processo_id}] Salvando arquivos em: {custos_path}, {frotas_path}")
        
        with open(custos_path, "wb") as buffer:
            content = await planilha_custos.read()
            buffer.write(content)
        
        with open(frotas_path, "wb") as buffer:
            content = await relacao_frotas.read()
            buffer.write(content)
            
        # Resetar os ponteiros de arquivo depois da leitura
        await planilha_custos.seek(0)
        await relacao_frotas.seek(0)

        logger.info(f"[{processo_id}] Arquivos salvos com sucesso, iniciando processamento")
        
        # Definir caminho de saída personalizado para este processamento
        output_filename = f"planilha_organizada_{processo_id}.xlsx"
        output_path = os.path.join(processo_dir, output_filename)
        
        # Chamar o script organiza_frotas.py para processar os arquivos recebidos
        # O script espera os arquivos na ordem: custos, frotas
        start_time = time.time()
        result = subprocess.run([
            'python',
            os.path.join(SCRIPTS_DIR, 'organiza_frotas.py'),
            custos_path,
            frotas_path,
            output_path  # Passar o caminho de saída como argumento
        ], check=True, capture_output=True, text=True)
        
        processing_time = time.time() - start_time
        logger.info(f"[{processo_id}] Processamento concluído em {processing_time:.2f} segundos")
        
        # Verificar saída do processo
        if result.stdout:
            logger.info(f"[{processo_id}] Saída do script: {result.stdout}")
        if result.stderr:
            logger.warning(f"[{processo_id}] Erros do script: {result.stderr}")

        # Verificar se o arquivo de saída foi gerado
        if not os.path.exists(output_path):
            logger.error(f"[{processo_id}] Arquivo de saída não encontrado: {output_path}")
            raise HTTPException(status_code=500, detail='Arquivo de saída não gerado.')
            
        logger.info(f"[{processo_id}] Enviando arquivo de resposta: {output_path}")
        
        # Fazer backup do arquivo gerado (para histórico)
        backup_path = os.path.join(HISTORICO_DIR, hoje)
        os.makedirs(backup_path, exist_ok=True)
        shutil.copy2(output_path, os.path.join(backup_path, f"resultado_{processo_id}.xlsx"))
        
        # Retornar o arquivo processado usando StreamingResponse para melhor compatibilidade com CORS
        with open(output_path, "rb") as f:
            content = f.read()
            
        headers = {
            'Content-Disposition': 'attachment; filename=planilha_organizada.xlsx',
            'Access-Control-Expose-Headers': 'Content-Disposition'
        }
        
        from fastapi.responses import StreamingResponse
        import io
        
        return StreamingResponse(
            io.BytesIO(content),
            media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers=headers
        )
    except subprocess.CalledProcessError as e:
        logger.error(f"[{processo_id}] Erro no processamento do script: {str(e)}")
        if e.output:
            logger.error(f"[{processo_id}] Detalhes do erro: {e.output}")
        raise HTTPException(status_code=500, detail=f"Erro no processamento: {str(e)}")
    except Exception as e:
        logger.error(f"[{processo_id}] Erro inesperado: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
