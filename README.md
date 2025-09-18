# Sistema de Processamento de Planilhas de Frotas

Este sistema permite processar planilhas de custos de frotas e gerar relatórios organizados. Agora com **integração com Power BI** para análises avançadas!

## Estrutura do Projeto

```
PROJETO_FROTA2/
+-- backend/                    # Servidor API FastAPI
|   +-- app/                    # Código da aplicação backend
|   |   +-- main.py             # Ponto de entrada da API
|   |   +-- routers/            # Endpoints da API
|   |   |   +-- km_rodados.py   # Processamento de planilhas de KM
|   |   |   +-- powerbi.py      # Download de templates Power BI
|   |   +-- scripts/            # Scripts auxiliares
|   |   +-- static/             # Arquivos estáticos
|   |       +-- templates/      # Templates Power BI
|   +-- data/                   # Dados da aplicação
|   |   +-- uploads/            # Arquivos enviados pelos usuários
|   |   +-- historico/          # Resultados históricos
|   +-- logs/                   # Logs da aplicação
|   +-- tests/                  # Testes unitários e integração
|   +-- requirements.txt        # Dependências Python
|   +-- run.py                  # Script para iniciar o servidor
|   +-- start.bat               # Script para iniciar o servidor (Windows)
|
+-- frontend/                   # Interface web React
|   +-- public/                 # Arquivos estáticos
|   +-- src/                    # Código fonte React
|   |   +-- components/         # Componentes React
|   |   |   +-- ProcessarKM.js  # Componente para processamento de KM
|   |   +-- styles/             # Estilos da aplicação
|   |   +-- App.js              # Componente principal
|   +-- package.json            # Dependências e configurações
|   +-- start.bat               # Script para iniciar o frontend (Windows)
|
+-- dados-exemplo/              # Exemplos de arquivos para processamento
+-- docs/                       # Documentação do projeto
|   +-- GUIA_IMPLANTACAO.md     # Guia de implantação
|   +-- RENDER_DEPLOY.md        # Instruções para Render
|   +-- VERCEL_DEPLOY.md        # Instruções para Vercel
+-- POWER_BI_README.md          # Instruções do Power BI
+-- scripts/                    # Scripts de utilidades
|   +-- build.bat               # Script para construir o projeto para produção
|   +-- deploy.bat              # Script para implantação
|   +-- iniciar_sistema.bat     # Script para iniciar o sistema completo
|   +-- limpar_temporarios.bat  # Script para limpar arquivos temporários
+-- .gitignore                  # Configuração de arquivos a ignorar no Git
+-- iniciar.bat                 # Menu para escolher operações do sistema
+-- README.md                   # Este arquivo de documentação
```

## Novidades

### Integração com Power BI

O sistema agora oferece integração com Power BI, permitindo:

- Download de templates Power BI prontos para uso
- Conexão direta com os dados processados
- Dashboards e visualizações interativas
- Análises avançadas dos dados de frota

Para mais detalhes, consulte o [Guia de Integração com Power BI](./POWER_BI_README.md).

## Requisitos

### Backend

- Python 3.8+
- Bibliotecas listadas em backend/requirements.txt

### Frontend

- Node.js 18+
- Dependências NPM listadas em frontend/package.json

### Power BI (opcional)

- Power BI Desktop (para uso das funcionalidades de análise avançada)

## Como Iniciar o Sistema

### Método Rápido (Windows)

1. Execute o script `iniciar.bat` na raiz do projeto
2. Escolha a opção 1 para iniciar o sistema completo
3. O sistema iniciará automaticamente o backend e o frontend
4. Acesse http://localhost:3000 no seu navegador

### Backend (Manual)

1. Navegue até a pasta `backend`
2. Execute o script `start.bat` (Windows) ou `python run.py` (Linux/Mac)
3. O servidor estará disponível em http://localhost:8000

### Frontend (Manual)

1. Navegue até a pasta `frontend`
2. Execute o script `start.bat` (Windows) ou `npm start` (Linux/Mac)
3. O aplicativo web estará disponível em http://localhost:3000

## Limpeza de Arquivos Temporários

Para remover arquivos temporários e organizar o projeto:

1. Execute o script `iniciar.bat` e escolha a opção 3
2. Os arquivos Excel serão movidos para a pasta dados-exemplo
3. Diretórios temporários como __pycache__ serão removidos

## Implantação em Produção

Para implantar o sistema em um ambiente de produção:

1. Execute o script `iniciar.bat` e escolha a opção 2 para compilar o projeto
2. Configure os arquivos .env.production no frontend e backend
3. Execute o script `iniciar.bat` e escolha a opção 4 para implantar em um servidor

Para informações detalhadas sobre implantação, consulte a [documentação de implantação](./docs/README.md).

## Endpoints da API

### GET /teste/

Verifica se a API está funcionando.

### POST /teste-upload/

Endpoint para testar o upload de arquivos.

### POST /processar-planilhas/

Processa planilhas de custos e relação de frotas.

**Parâmetros:**

- planilha_custos - Arquivo Excel com dados de custos
- relacao_frotas - Arquivo Excel com relação de frotas

**Resposta:**

- Arquivo Excel com os dados processados

### POST /processar-km/

Processa planilhas de KM rodados.

**Parâmetros:**

- planilha_km - Arquivo Excel com dados de KM rodados
- planilha_organizada - Arquivo Excel processado na etapa anterior

**Resposta:**

- Arquivo Excel com os dados de KM processados

### GET /template-powerbi/

Baixa o template do Power BI para análises avançadas.

**Resposta:**

- Arquivo .pbit (template do Power BI)

### GET /download-zip/{filename}

Baixa um pacote ZIP com a planilha Excel e o template Power BI.

**Parâmetros:**

- filename - Nome do arquivo Excel a incluir no ZIP

**Resposta:**

- Arquivo ZIP contendo a planilha Excel e o template Power BI