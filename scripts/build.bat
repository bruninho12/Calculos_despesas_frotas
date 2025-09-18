@echo off
echo =====================================================================
echo  Sistema de Processamento de Planilhas - Build para Produção
echo =====================================================================

echo [1/5] Verificando requisitos...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js não encontrado! Por favor, instale o Node.js 18 ou superior.
    goto :error
)

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Python não encontrado! Por favor, instale o Python 3.8 ou superior.
    goto :error
)

echo [2/5] Copiando arquivos de ambiente para produção...
if exist frontend\.env (
    if not exist frontend\.env.production (
        copy frontend\.env frontend\.env.production
        echo Arquivo frontend\.env.production criado. Por favor, revise as configurações.
    )
)

if exist backend\.env (
    if not exist backend\.env.production (
        copy backend\.env backend\.env.production
        echo Arquivo backend\.env.production criado. Por favor, revise as configurações.
    )
)

echo [3/5] Instalando dependências do frontend...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha ao instalar dependências do frontend.
    cd ..
    goto :error
)

echo [4/5] Construindo o frontend para produção...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha ao construir o frontend.
    cd ..
    goto :error
)
echo Frontend construído com sucesso!
cd ..

echo [5/5] Instalando dependências do backend...
cd backend
if not exist venv (
    echo Criando ambiente virtual Python...
    python -m venv venv
    call venv\Scripts\activate
) else (
    call venv\Scripts\activate
)
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha ao instalar dependências do backend.
    cd ..
    goto :error
)
echo Dependências do backend instaladas com sucesso!
cd ..

echo.
echo Projeto pronto para implantação!
echo.
echo Próximos passos:
echo 1. Revise os arquivos .env.production em frontend/ e backend/
echo 2. Execute deploy.bat para implantar em um servidor
echo 3. Ou configure manualmente conforme o GUIA_IMPLANTACAO.md
echo.
goto :end

:error
echo.
echo Falha na construção do projeto.
echo Verifique os erros acima e tente novamente.
pause > nul
exit /b 1

:end
