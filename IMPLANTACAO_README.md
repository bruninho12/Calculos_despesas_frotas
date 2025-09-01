# Implantação do Sistema

Este documento descreve os passos necessários para implantar este sistema em um ambiente de produção.

## Requisitos do Servidor

- Windows Server 2019+ com IIS ou Linux com Nginx/Apache
- Python 3.8+ instalado
- Node.js 18+ (apenas para build)
- 2GB RAM mínimo recomendado
- 10GB espaço em disco

## Arquivos de Implantação

Este projeto inclui vários arquivos para facilitar a implantação:

1. `build.bat` - Prepara o projeto para produção
2. `deploy.bat` - Implanta o sistema em um servidor
3. `GUIA_IMPLANTACAO.md` - Documentação detalhada de implantação

## Processo de Implantação Passo a Passo

### 1. Preparação

1. Clone o repositório em sua máquina de desenvolvimento
2. Configure os arquivos de ambiente:
   - `backend/.env.production`
   - `frontend/.env.production`

### 2. Build

Execute o script de build para preparar os arquivos:

```
build.bat
```

### 3. Implantação

#### Opção A: Usando o script automatizado

1. Edite o arquivo `deploy.bat` para configurar o servidor de destino
2. Execute o script:
   ```
   deploy.bat
   ```

#### Opção B: Implantação manual

1. Copie a pasta `frontend/build` para a raiz do seu servidor web
2. Copie a pasta `backend` (exceto venv e **pycache**) para o servidor
3. Configure o servidor web conforme o GUIA_IMPLANTACAO.md

#### Opção C: Implantação com Vercel

1. Crie uma conta na Vercel (https://vercel.com)
2. Implante o frontend:
   ```
   cd frontend
   npm install -g vercel
   vercel login
   vercel
   ```
3. Configure o backend em um servidor separado ou use Vercel Serverless Functions
4. Veja detalhes completos no GUIA_IMPLANTACAO.md, seção 6

### 4. Configuração do Servidor

#### IIS (Windows)

1. Crie um novo site no IIS apontando para a pasta do frontend
2. Configure um aplicativo para a API apontando para a pasta do backend
3. Instale o URL Rewrite Module para redirecionamentos

#### Nginx (Linux)

Consulte o exemplo de configuração no GUIA_IMPLANTACAO.md

### 5. Iniciando o Backend

No servidor:

1. Navegue até a pasta do backend
2. Crie um ambiente virtual Python:
   ```
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```
3. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
4. Inicie o servidor:
   ```
   python run.py
   ```

### 6. Verificação

Verifique se o sistema está funcionando corretamente:

1. Acesse a URL do frontend em seu navegador
2. Teste o upload e processamento de planilhas
3. Verifique os logs em `backend/logs/`
