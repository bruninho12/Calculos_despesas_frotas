import uvicorn
import os
from dotenv import load_dotenv

if __name__ == "__main__":
    # Carregar variáveis de ambiente do arquivo .env
    load_dotenv()
    
    # Obter configurações do servidor a partir das variáveis de ambiente
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("AMBIENTE", "development") != "producao"
    
    print(f"Iniciando servidor no modo: {'desenvolvimento' if debug else 'produção'}")
    print(f"Servidor rodando em: http://{host}:{port}")
    
    # Iniciar o servidor
    uvicorn.run("app.main:app", host=host, port=port, reload=debug)
