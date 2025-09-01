# Sistema de Processamento de Planilhas de Frotas

Este sistema permite processar planilhas de custos de frotas e gerar relatórios organizados.

## Estrutura do Projeto

```
PROJETO_FROTA2/
├── backend/                    # Servidor API FastAPI
│   ├── app/                    # Código da aplicação backend
│   │   ├── main.py            # Ponto de entrada da API
│   │   └── routers/           # Endpoints da API
│   │       └── km_rodados.py  # Processamento de planilhas de KM
│   ├── data/                   # Dados da aplicação
│   │   ├── uploads/           # Arquivos enviados pelos usuários
│   │   └── historico/         # Resultados históricos
│   ├── logs/                   # Logs da aplicação
│   ├── requirements.txt        # Dependências Python
│   ├── run.py                  # Script para iniciar o servidor
│   └── start.bat               # Script para iniciar o servidor (Windows)
│
├── frontend/                   # Interface web React
│   ├── public/                 # Arquivos estáticos
│   ├── src/                    # Código fonte React
│   │   ├── components/        # Componentes React
│   │   │   └── ProcessarKM.js # Componente para processamento de KM
│   │   └── App.js             # Componente principal
│   ├── package.json            # Dependências e configurações
│   └── start.bat               # Script para iniciar o frontend (Windows)
│
├── dados-exemplo/              # Exemplos de arquivos para processamento
├── .gitignore                  # Configuração de arquivos a ignorar no Git
├── build.bat                   # Script para construir o projeto para produção
├── iniciar_sistema.bat         # Script para iniciar o sistema completo
├── limpar_temporarios.bat      # Script para limpar arquivos temporários
└── README.md                   # Este arquivo de documentação
```

## Requisitos

### Backend

- Python 3.8+
- Bibliotecas listadas em `backend/requirements.txt`

### Frontend

- Node.js 18+
- Dependências NPM listadas em `frontend/package.json`

## Como Iniciar o Sistema

### Método Rápido (Windows)

1. Execute o script `iniciar_sistema.bat` na raiz do projeto
2. O sistema iniciará automaticamente o backend e o frontend
3. Acesse http://localhost:3000 no seu navegador

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

1. Execute o script `limpar_temporarios.bat` na raiz do projeto
2. Os arquivos Excel serão movidos para a pasta `dados-exemplo`
3. Diretórios temporários como `__pycache__` serão removidos

## Implantação em Produção

Para implantar o sistema em um ambiente de produção:

1. Execute o script `build.bat` para preparar o projeto para produção
2. Configure os arquivos `.env.production` no frontend e backend
3. Execute o script `deploy.bat` para implantar em um servidor

Para informações detalhadas sobre implantação, consulte o arquivo `GUIA_IMPLANTACAO.md`.

## Endpoints da API

### GET /teste/

Verifica se a API está funcionando.

### POST /teste-upload/

Endpoint para testar o upload de arquivos.

### POST /processar-planilhas/

Processa planilhas de custos e relação de frotas.

**Parâmetros:**

- `planilha_custos` - Arquivo Excel com dados de custos
- `relacao_frotas` - Arquivo Excel com relação de frotas

**Resposta:**

- Arquivo Excel com os dados processados
