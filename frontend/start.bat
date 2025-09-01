@echo off
echo =====================================================================
echo  Sistema de Processamento de Planilhas - Frontend
echo =====================================================================

cd %~dp0

echo [1/3] Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js não encontrado! Por favor, instale o Node.js 18 ou superior.
    goto :error
)

echo [2/3] Verificando dependências...
if not exist node_modules (
    echo Instalando dependências do frontend...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERRO: Falha ao instalar as dependências!
        goto :error
    )
)

echo [3/3] Iniciando servidor de desenvolvimento React...
echo.
echo Frontend disponível em: http://localhost:3000
echo.
call npm start
goto :end

:error
echo.
echo Falha na inicialização do frontend.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
exit /b 1

:end
