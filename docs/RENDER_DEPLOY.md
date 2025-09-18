# Guia de Implantação do Backend no Render

Este guia fornece instruções detalhadas para implantar o backend do Sistema de Processamento de Planilhas de Frotas na plataforma Render.

## 1. Sobre o Render

O Render é uma plataforma de hospedagem na nuvem que facilita a implantação de aplicativos web, APIs e bancos de dados. Vantagens:

- Implantação contínua a partir do GitHub
- Certificados SSL gratuitos
- Escalonamento automático
- Monitoramento embutido
- Plano gratuito para iniciar

## 2. Preparando seu Backend

### 2.1 Arquivos de Configuração

Seu projeto já contém os arquivos necessários:

- `requirements.txt`: Lista de dependências Python
- `render.yaml`: Configuração para implantação no Render
- `Procfile`: Comando para iniciar o aplicativo

### 2.2 Estrutura de Arquivos para Render

```
backend/
├── app/
│   ├── main.py         # Ponto de entrada da aplicação FastAPI
│   └── routers/        # Endpoints da API
├── requirements.txt    # Dependências Python
├── render.yaml         # Configuração do Render
└── Procfile           # Comando de inicialização
```

## 3. Passos para Implantação no Render

### 3.1 Criar Conta no Render

1. Acesse [https://render.com](https://render.com)
2. Crie uma conta ou faça login com GitHub/GitLab

### 3.2 Conectar Repositório

1. No Dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório GitHub/GitLab
   - Se você já conectou, selecione o repositório na lista
   - Caso contrário, clique em "Connect account" e siga as instruções

### 3.3 Configurar o Serviço Web

Preencha os campos com estas informações:

- **Nome**: frota-api (ou outro nome de sua escolha)
- **Ambiente**: Python
- **Região**: Escolha a mais próxima dos seus usuários
- **Branch**: main (ou outro branch que contenha o código)
- **Diretório raiz**: backend (ou vazio, se seu repositório só contém o backend)
- **Comando de Build**: `pip install -r requirements.txt`
- **Comando de Start**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Plano**: Free (você pode mudar depois)

### 3.4 Configurar Variáveis de Ambiente

No painel de configuração, adicione estas variáveis de ambiente:

- `AMBIENTE`: producao
- `ALLOWED_ORIGINS`: https://calculos-despesas-frotas.vercel.app (URL do frontend no Vercel)
- Outras variáveis específicas da aplicação

### 3.5 Implantação Automática

- Marque a opção "Auto-Deploy" para implantar automaticamente quando houver novos commits
- Clique em "Create Web Service"

## 4. Testando o Backend no Render

Após a implantação (pode levar alguns minutos):

1. O Render fornecerá uma URL (algo como `https://frota-api.onrender.com`)
2. Teste o endpoint de verificação:
   ```
   https://frota-api.onrender.com/api/teste
   ```
3. Você deve receber uma resposta JSON indicando que a API está funcionando

## 5. Integrando com o Frontend no Vercel

### 5.1 Configuração do Frontend

1. No arquivo `frontend/vercel.json`:

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

2. No arquivo `frontend/.env.production`:
   ```
   REACT_APP_API_URL=/api
   ```

### 5.2 CORS e Segurança

No backend, certifique-se de que o CORS está configurado para permitir requisições do frontend:

```python
# No arquivo app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://calculos-despesas-frotas.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 6. Limitações do Plano Gratuito

O plano gratuito do Render tem algumas limitações:

- **Hibernação**: Os serviços gratuitos ficam inativos após 15 minutos sem tráfego
- **Recursos**: CPU e RAM limitados
- **Armazenamento**: 512 MB de armazenamento
- **Tempo de execução**: Algumas operações podem ter timeout

Para processamento de planilhas grandes, considere:

- Atualizar para um plano pago
- Otimizar o código para processamento em lotes
- Implementar sistema de fila para processar grandes arquivos

## 7. Monitoramento e Logs

O Render fornece ferramentas para monitorar seu aplicativo:

1. Na página do seu serviço, clique em "Logs" para ver os logs em tempo real
2. Configure alertas para notificações de erros
3. Monitore o uso de recursos na seção "Metrics"

## 8. Solução de Problemas

Problemas comuns e soluções:

1. **Falha na implantação**:

   - Verifique os logs de build
   - Certifique-se de que todas as dependências estão no requirements.txt
   - Teste localmente com um ambiente limpo

2. **Erro 503 Service Unavailable**:

   - Serviço pode estar iniciando após hibernação (aguarde 30 segundos)
   - Verifique os logs para erros de inicialização

3. **Problemas de CORS**:
   - Verifique se a URL do frontend está corretamente configurada
   - Teste com a configuração mais permissiva e restrinja depois

Para mais ajuda, consulte a documentação do Render em [https://render.com/docs](https://render.com/docs)
