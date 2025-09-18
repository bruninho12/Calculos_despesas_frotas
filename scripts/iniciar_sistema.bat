@echo off
echo =====================================================================
echo  Sistema de Processamento de Planilhas de Frotas - Inicialização
echo =====================================================================

set BACKEND_DIR=%~dp0backend
set FRONTEND_DIR=%~dp0frontend

echo [1/4] Verificando requisitos...

REM Verificar se o Python está instalado
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Python não encontrado! Por favor, instale o Python 3.8 ou superior.
    goto :error
)

REM Verificar se o Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Node.js não encontrado! Por favor, instale o Node.js 18 ou superior.
    goto :error
)

echo [2/4] Iniciando o backend...
start cmd /k "title Backend - Sistema de Processamento de Frotas && cd /d %BACKEND_DIR% && start.bat"

echo [3/4] Aguardando 5 segundos para o backend iniciar...
timeout /t 5 /nobreak > nul

echo [4/4] Iniciando o frontend...
start cmd /k "title Frontend - Sistema de Processamento de Frotas && cd /d %FRONTEND_DIR% && start.bat"

echo.
echo Sistema iniciado com sucesso!
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Acesse http://localhost:3000 no seu navegador para usar o sistema.
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
exit /b 0

:error
echo.
echo Falha na inicialização do sistema.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
exit /b 1
