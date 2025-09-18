# Guia de Implantação no Vercel

Este guia fornece instruções detalhadas para implantar o Sistema de Processamento de Planilhas de Frotas na plataforma Vercel.

## Visão Geral

O Vercel é uma plataforma de hospedagem que oferece:

- Implantação contínua a partir do GitHub/GitLab
- Certificados SSL gratuitos e automáticos
- Preview deployments para cada commit
- Funções serverless
- CDN global

## 1. Preparando o Frontend para o Vercel

### 1.1 Crie um arquivo `vercel.json`

Crie um arquivo chamado `vercel.json` na pasta `frontend` com o seguinte conteúdo:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://url-do-seu-backend.com/api/:path*"
    }
  ],
  "build": {
    "env": {
      "REACT_APP_API_URL": "/api"
    }
  }
}
```

**Observação**: Substitua `https://url-do-seu-backend.com` pela URL real do seu backend quando estiver disponível.

### 1.2 Ajuste o arquivo `.env.production`

Atualize o arquivo `frontend/.env.production`:

```
REACT_APP_API_URL=/api
```

## 2. Implantando o Frontend no Vercel

### 2.1 Usando a Interface Web

1. Crie uma conta em [https://vercel.com](https://vercel.com)
2. Clique em "Add New..." > "Project"
3. Conecte sua conta do GitHub/GitLab/Bitbucket
4. Selecione o repositório do projeto
5. Configure as opções de build:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
6. Clique em "Deploy"

### 2.2 Usando a CLI do Vercel

1. Instale a CLI do Vercel:

   ```
   npm install -g vercel
   ```

2. Faça login na sua conta Vercel:

   ```
   vercel login
   ```

3. Navegue até a pasta frontend:

   ```
   cd frontend
   ```

4. Implante o projeto:

   ```
   vercel
   ```

5. Siga as instruções interativas:
   - Configure o projeto para sua conta pessoal
   - Selecione o nome do projeto ou aceite o sugerido
   - Defina a pasta raiz como `./` (atual)
   - Confirme as configurações de build

## 3. Opções para o Backend

### 3.1 Hospedando o Backend Separadamente

Esta é a abordagem recomendada para aplicações que processam arquivos grandes:

1. Implante o backend em:

   - Railway (https://railway.app)
   - Render (https://render.com)
   - DigitalOcean App Platform
   - Heroku

#### Implantando o Backend no Render

O Render é uma ótima escolha para hospedar seu backend Python.

**Para instruções detalhadas, consulte o arquivo [RENDER_DEPLOY.md](RENDER_DEPLOY.md)**

Resumo das etapas:

1. **Crie uma conta no Render**:

   - Acesse [https://render.com](https://render.com) e registre-se
   - Você pode usar sua conta GitHub para agilizar o processo

2. **Prepare seu repositório**:

   - Certifique-se de que o arquivo `requirements.txt` está atualizado
   - Crie um arquivo `render.yaml` na raiz do backend:
     ```yaml
     services:
       - type: web
         name: frota-api
         env: python
         buildCommand: pip install -r requirements.txt
         startCommand: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
         envVars:
           - key: AMBIENTE
             value: producao
     ```

3. **Implante o serviço no Render**:

   - No dashboard do Render, clique em "New +"
   - Selecione "Web Service"
   - Conecte seu repositório GitHub
   - Configure as opções:
     - Nome: frota-api
     - Ambiente: Python
     - Região: Escolha a mais próxima do seu público
     - Branch: main
     - Diretório raiz: `backend` (ou deixe em branco se seu repositório só contém o backend)
     - Comando de Build: `pip install -r requirements.txt`
     - Comando de Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Clique em "Create Web Service"

4. **Configure variáveis de ambiente**:

   - No painel do serviço, vá para "Environment"
   - Adicione as variáveis necessárias:
     - `AMBIENTE`: producao
     - `ALLOWED_ORIGINS`: https://calculos-despesas-frotas.vercel.app
     - Outras variáveis conforme necessário

5. **Ajuste os recursos**:

   - O plano gratuito do Render tem algumas limitações, mas é bom para começar
   - Para processamento de arquivos grandes, considere atualizar para um plano pago

6. Atualize o arquivo `vercel.json` no frontend com a URL do Render:

   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://frota-api-qro2.onrender.com/api/:path*"
       }
     ]
   }
   ```

   **Nota**: Substitua `frota-api.onrender.com` pela URL real do seu serviço no Render. O Render fornecerá um domínio no formato `nome-do-app.onrender.com`.

7. **Integração do Vercel com o Render**:

   - No Render, certifique-se de configurar os cabeçalhos CORS:

     ```python
     # No arquivo app/main.py do backend
     from fastapi.middleware.cors import CORSMiddleware

     app.add_middleware(
         CORSMiddleware,
         allow_origins=["https://calculos-despesas-frotas.vercel.app"],
         allow_credentials=True,
         allow_methods=["*"],
         allow_headers=["*"],
     )
     ```

   - Teste a comunicação entre frontend e backend:
     - Implante uma versão inicial do frontend no Vercel
     - Faça uma chamada simples para verificar se a API está respondendo

### 3.2 Usando Vercel Serverless Functions (Limitado)

**Atenção**: Esta abordagem tem limitações para processamento de arquivos grandes. Use apenas para APIs simples.

1. Crie uma pasta `api` dentro da pasta `frontend`:

   ```
   mkdir -p frontend/api
   ```

2. Crie um arquivo `frontend/api/index.py`:

   ```python
   from http.server import BaseHTTPRequestHandler

   class handler(BaseHTTPRequestHandler):
       def do_GET(self):
           self.send_response(200)
           self.send_header('Content-type', 'application/json')
           self.end_headers()
           self.wfile.write(str('{"message": "API funcionando!"}').encode())
           return
   ```

3. Crie um arquivo `requirements.txt` na pasta `frontend`:

   ```
   fastapi==0.68.0
   uvicorn==0.15.0
   ```

4. Atualize o arquivo `vercel.json` para incluir o backend:
   ```json
   {
     "builds": [
       { "src": "api/index.py", "use": "@vercel/python" },
       { "src": "package.json", "use": "@vercel/static-build" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "/api/index.py" },
       { "src": "/(.*)", "dest": "/$1" }
     ]
   }
   ```

## 4. Configurando Variáveis de Ambiente

1. Na interface web do Vercel:

   - Selecione seu projeto
   - Vá para "Settings" > "Environment Variables"
   - Adicione as variáveis necessárias

2. Via CLI:
   ```
   vercel env add NOME_DA_VARIAVEL
   ```

## 5. Adicionando um Domínio Personalizado

1. Na interface web do Vercel:

   - Selecione seu projeto
   - Vá para "Settings" > "Domains"
   - Adicione seu domínio
   - Siga as instruções para configurar os registros DNS

2. Via CLI:
   ```
   vercel domains add seu-dominio.com
   ```

## 6. Atualizações e Implantação Contínua

O Vercel automaticamente implantará novas versões quando você:

1. Fizer push para o branch principal do repositório conectado
2. Ou executar `vercel` na linha de comando

## 7. Limitações e Considerações

- **Tempo de Execução**: Funções serverless no Vercel têm limite de tempo de execução (geralmente 10-60 segundos)
- **Tamanho de Arquivos**: Há limitações para upload e processamento de arquivos grandes
- **Persistência de Dados**: As funções serverless não mantêm estado entre execuções

Para processamento pesado de planilhas, considere:

1. Usar apenas o frontend no Vercel
2. Hospedar o backend em um servidor tradicional com recursos adequados
3. Configurar um proxy no Vercel para redirecionar chamadas API para seu backend
