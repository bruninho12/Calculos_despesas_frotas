# Guia de Implantação: Sistema de Processamento de Planilhas de Frotas

Este guia detalha os passos necessários para implantar o sistema em um ambiente de produção.

## 1. Preparação do Ambiente

### Opção 1: Servidor Windows (IIS)

1. Instale o IIS (Internet Information Services) no servidor Windows
2. Instale o Python 3.8+ e o Node.js 18+ no servidor
3. Instale o módulo WSGI para IIS (como o WFastCGI)

### Opção 2: Servidor Linux

1. Instale o Python 3.8+ e o Node.js 18+ no servidor
2. Instale o Nginx ou Apache como servidor web
3. Configure o servidor para usar Gunicorn/Uvicorn para Python

## 2. Construindo o Projeto para Produção

Execute o script de build para preparar os arquivos para produção:

```
build.bat
```

Este script irá:

- Construir a versão de produção do frontend React
- Instalar as dependências do backend

## 3. Configuração de Ambiente

1. Configure as variáveis de ambiente no arquivo `.env.production`:

```
API_HOST=seu-dominio-ou-ip
API_PORT=8000
FRONTEND_URL=https://seu-dominio.com
LOG_LEVEL=info
CORS_ORIGINS=https://seu-dominio.com
```

2. Configure o banco de dados (se necessário)

## 4. Opções de Implantação

### 4.1 Implantação Local

#### Backend

1. Copie a pasta `backend` para o servidor
2. Configure um serviço ou agendador de tarefas para executar:
   ```
   cd /caminho/para/backend
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

#### Frontend

1. Copie os arquivos da pasta `frontend/build` para a pasta raiz do seu servidor web

### 4.2 Implantação na Nuvem

#### Azure

1. Crie um serviço Azure App Service para o backend
2. Configure o arquivo de implantação (deployment) para Python
3. Crie um serviço Azure Static Web App para o frontend
4. Configure os arquivos de ambiente com as URLs corretas

#### AWS

1. Use AWS Elastic Beanstalk para o backend Python
2. Use AWS S3 + CloudFront para hospedar o frontend
3. Configure o CORS apropriadamente

#### Heroku

1. Crie uma aplicação Heroku para o backend
2. Configure o Procfile:
   ```
   web: cd backend && uvicorn app.main:app --host=0.0.0.0 --port=$PORT
   ```
3. Use Netlify ou Vercel para o frontend

#### Vercel (Recomendado para o Frontend)

1. Crie uma conta na Vercel (https://vercel.com) se ainda não tiver
2. Instale a Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Faça login na sua conta:
   ```
   vercel login
   ```
4. Configure seu projeto para implantação:
   - Navegue até a pasta do frontend: `cd frontend`
   - Execute: `vercel`
   - Siga as instruções para configurar seu projeto
5. Configure as variáveis de ambiente no dashboard da Vercel:
   - REACT_APP_API_URL=https://url-do-seu-backend.com

## 5. Configuração de HTTPS

Para produção, é essencial configurar HTTPS:

1. Obtenha certificados SSL (Let's Encrypt é uma opção gratuita)
2. Configure o servidor web para usar HTTPS
3. Atualize todas as URLs no frontend para usar HTTPS

## 6. Implantação Completa usando Vercel

O Vercel é uma plataforma moderna para implantação de aplicações web, que oferece:

- Implantação contínua automática a partir do GitHub/GitLab
- Certificados SSL gratuitos
- Domínios personalizados
- Ambiente de pré-visualização para cada commit
- Integrações com vários serviços

### 6.1 Implantando o Frontend no Vercel

**Para instruções detalhadas, consulte o arquivo [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md)**

1. **Prepare seu projeto para o Vercel**:

   - Crie um arquivo `vercel.json` na raiz do frontend:

   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://url-do-seu-backend.com/:path*"
       }
     ],
     "build": {
       "env": {
         "REACT_APP_API_URL": "/api"
       }
     }
   }
   ```

2. **Faça o deploy através da interface web**:

   - Crie uma conta em https://vercel.com
   - Conecte sua conta GitHub/GitLab
   - Importe seu repositório
   - Configure as opções:
     - Diretório raiz: `frontend`
     - Comando de build: `npm run build`
     - Diretório de saída: `build`
   - Clique em Deploy

3. **Alternativa usando CLI**:
   - Instale a Vercel CLI: `npm i -g vercel`
   - Execute dentro da pasta frontend: `vercel`
   - Siga as instruções interativas

### 6.2 Implantando o Backend no Vercel (Serverless)

O Vercel também suporta APIs Python usando funções serverless:

1. **Crie um arquivo `api/index.py` na pasta frontend**:

   ```python
   from fastapi import FastAPI, Request
   from fastapi.middleware.cors import CORSMiddleware
   from fastapi.responses import JSONResponse

   app = FastAPI()

   # Configuração básica para API
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )

   @app.get("/api/teste")
   async def read_root():
       return {"message": "API funcionando!"}
   ```

2. **Crie um arquivo `requirements.txt` na pasta frontend**:

   ```
   fastapi
   ```

3. **Crie um arquivo `vercel.json` atualizado na pasta frontend**:

   ```json
   {
     "builds": [
       { "src": "api/index.py", "use": "@vercel/python" },
       { "src": "package.json", "use": "@vercel/static-build" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "api/index.py" },
       { "src": "/(.*)", "dest": "/index.html" }
     ]
   }
   ```

4. **Implante no Vercel**:
   - Execute: `vercel` na pasta frontend

**Nota importante**: Para aplicações que processam arquivos grandes ou exigem operações de longa duração, o modelo serverless do Vercel pode não ser adequado. Para esses casos, considere:

1. Hospede apenas o frontend no Vercel
2. Implante o backend em:
   - Railway (https://railway.app)
   - Render (https://render.com)
   - DigitalOcean App Platform
   - Heroku

## 7. Implantação Contínua (Opcional)

Configure CI/CD para automação de implantação:

1. GitHub Actions
2. Azure DevOps
3. Jenkins

## 7. Monitoramento e Manutenção

1. Configure logs:

   - Os logs do backend são armazenados em `backend/logs/`
   - Configure o nível de log em `.env.production`

2. Monitore o uso de recursos:

   - CPU, memória e espaço em disco
   - Tempo de resposta da API

3. Backup regular dos dados:
   - Configure um backup automático para `backend/data/`

## 8. Exemplo de Script de Implantação no Windows

Crie um arquivo `deploy.bat` na raiz do projeto:

```bat
@echo off
echo =====================================================================
echo  Sistema de Processamento de Planilhas - Implantação em Produção
echo =====================================================================

REM Construir o projeto
call build.bat

REM Copiar arquivos para o servidor
echo Copiando arquivos para o servidor...
robocopy "frontend\build" "\\servidor\caminho\para\www" /E
robocopy "backend" "\\servidor\caminho\para\api" /E /XD "venv" "__pycache__"

echo Implantação concluída!
```

## 9. Exemplo de Configuração Nginx (Linux)

```nginx
# Frontend
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/html/frota-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Backend API
server {
    listen 80;
    server_name api.seu-dominio.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 10. Verificação Pré-Implantação

Execute esta lista de verificação antes de publicar:

1. Teste todas as funcionalidades em ambiente de homologação
2. Verifique se os arquivos `.env.production` estão configurados corretamente
3. Certifique-se de que o frontend está apontando para a URL correta da API
4. Verifique se o servidor tem todas as dependências necessárias instaladas
5. Teste o processo de backup e restauração
