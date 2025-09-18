# Sistema de Processamento de Planilhas de Frotas

Este sistema permite processar planilhas de custos de frotas e gerar relat�rios organizados.

## Estrutura do Projeto

`
PROJETO_FROTA2/
+-- backend/                    # Servidor API FastAPI
�   +-- app/                    # C�digo da aplica��o backend
�   �   +-- main.py            # Ponto de entrada da API
�   �   +-- routers/           # Endpoints da API
�   �   �   +-- km_rodados.py  # Processamento de planilhas de KM
�   �   +-- scripts/           # Scripts auxiliares
�   +-- data/                   # Dados da aplica��o
�   �   +-- uploads/           # Arquivos enviados pelos usu�rios
�   �   +-- historico/         # Resultados hist�ricos
�   +-- logs/                   # Logs da aplica��o
�   +-- tests/                  # Testes unit�rios e integra��o
�   +-- requirements.txt        # Depend�ncias Python
�   +-- run.py                  # Script para iniciar o servidor
�   +-- start.bat               # Script para iniciar o servidor (Windows)
�
+-- frontend/                   # Interface web React
�   +-- public/                 # Arquivos est�ticos
�   +-- src/                    # C�digo fonte React
�   �   +-- components/        # Componentes React
�   �   �   +-- ProcessarKM.js # Componente para processamento de KM
�   �   +-- styles/            # Estilos da aplica��o
�   �   +-- App.js             # Componente principal
�   +-- package.json            # Depend�ncias e configura��es
�   +-- start.bat               # Script para iniciar o frontend (Windows)
�
+-- dados-exemplo/              # Exemplos de arquivos para processamento
+-- docs/                       # Documenta��o do projeto
�   +-- GUIA_IMPLANTACAO.md     # Guia de implanta��o
�   +-- RENDER_DEPLOY.md        # Instru��es para Render
�   +-- VERCEL_DEPLOY.md        # Instru��es para Vercel
+-- scripts/                    # Scripts de utilidades
�   +-- build.bat               # Script para construir o projeto para produ��o
�   +-- deploy.bat              # Script para implanta��o
�   +-- iniciar_sistema.bat     # Script para iniciar o sistema completo
�   +-- limpar_temporarios.bat  # Script para limpar arquivos tempor�rios
+-- .gitignore                  # Configura��o de arquivos a ignorar no Git
+-- iniciar.bat                 # Menu para escolher opera��es do sistema
+-- README.md                   # Este arquivo de documenta��o
`

## Requisitos

### Backend

- Python 3.8+
- Bibliotecas listadas em ackend/requirements.txt

### Frontend

- Node.js 18+
- Depend�ncias NPM listadas em rontend/package.json

## Como Iniciar o Sistema

### M�todo R�pido (Windows)

1. Execute o script iniciar.bat na raiz do projeto
2. Escolha a op��o 1 para iniciar o sistema completo
3. O sistema iniciar� automaticamente o backend e o frontend
4. Acesse http://localhost:3000 no seu navegador

### Backend (Manual)

1. Navegue at� a pasta ackend
2. Execute o script start.bat (Windows) ou python run.py (Linux/Mac)
3. O servidor estar� dispon�vel em http://localhost:8000

### Frontend (Manual)

1. Navegue at� a pasta rontend
2. Execute o script start.bat (Windows) ou 
pm start (Linux/Mac)
3. O aplicativo web estar� dispon�vel em http://localhost:3000

## Limpeza de Arquivos Tempor�rios

Para remover arquivos tempor�rios e organizar o projeto:

1. Execute o script iniciar.bat e escolha a op��o 3
2. Os arquivos Excel ser�o movidos para a pasta dados-exemplo
3. Diret�rios tempor�rios como __pycache__ ser�o removidos

## Implanta��o em Produ��o

Para implantar o sistema em um ambiente de produ��o:

1. Execute o script iniciar.bat e escolha a op��o 2 para compilar o projeto
2. Configure os arquivos .env.production no frontend e backend
3. Execute o script iniciar.bat e escolha a op��o 4 para implantar em um servidor

Para informa��es detalhadas sobre implanta��o, consulte a [documenta��o de implanta��o](./docs/README.md).

## Endpoints da API

### GET /teste/

Verifica se a API est� funcionando.

### POST /teste-upload/

Endpoint para testar o upload de arquivos.

### POST /processar-planilhas/

Processa planilhas de custos e rela��o de frotas.

**Par�metros:**

- planilha_custos - Arquivo Excel com dados de custos
- elacao_frotas - Arquivo Excel com rela��o de frotas

**Resposta:**

- Arquivo Excel com os dados processados
