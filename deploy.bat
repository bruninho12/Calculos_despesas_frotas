@echo off
echo =====================================================================
echo  Sistema de Processamento de Planilhas - Implantação em Produção
echo =====================================================================

set SERVIDOR=NOME_SERVIDOR
set FRONTEND_DESTINO=\\%SERVIDOR%\c$\inetpub\wwwroot\frota-app
set BACKEND_DESTINO=\\%SERVIDOR%\c$\apps\frota-api

echo [1/5] Construindo projeto para produção...
call build.bat
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha ao construir o projeto.
    goto :error
)

echo [2/5] Verificando arquivos de configuração...
if not exist frontend\.env.production (
    echo ERRO: Arquivo frontend\.env.production não encontrado.
    echo Crie o arquivo com as configurações de produção.
    goto :error
)

if not exist backend\.env.production (
    echo ERRO: Arquivo backend\.env.production não encontrado.
    echo Crie o arquivo com as configurações de produção.
    goto :error
)

echo [3/5] Criando diretórios no servidor...
if not exist "%FRONTEND_DESTINO%" mkdir "%FRONTEND_DESTINO%"
if not exist "%BACKEND_DESTINO%" mkdir "%BACKEND_DESTINO%"

echo [4/5] Copiando frontend para o servidor...
robocopy "frontend\build" "%FRONTEND_DESTINO%" /E /MIR

echo [5/5] Copiando backend para o servidor...
robocopy "backend" "%BACKEND_DESTINO%" /E /MIR /XD "venv" "__pycache__" "logs"

echo.
echo Implantação concluída!
echo.
echo Lembre-se de:
echo 1. Verificar as permissões dos diretórios no servidor
echo 2. Iniciar o serviço do backend com 'python run.py'
echo 3. Configurar o IIS para apontar para o diretório do frontend
echo.
echo Para mais detalhes, consulte o arquivo GUIA_IMPLANTACAO.md
echo.
goto :end

:error
echo.
echo Falha na implantação do sistema.
echo Verifique os erros acima e tente novamente.
pause > nul
exit /b 1

:end
pause
