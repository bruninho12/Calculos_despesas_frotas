@echo off
echo =====================================================================
echo  Sistema de Processamento de Planilhas de Frotas
echo =====================================================================
echo.
echo Escolha uma opção:
echo.
echo 1. Iniciar o sistema (frontend e backend)
echo 2. Compilar o projeto
echo 3. Limpar arquivos temporários
echo 4. Preparar para implantação
echo 0. Sair
echo.

set /p opcao="Digite o número da opção desejada: "

if "%opcao%"=="1" goto iniciar
if "%opcao%"=="2" goto compilar
if "%opcao%"=="3" goto limpar
if "%opcao%"=="4" goto implantar
if "%opcao%"=="0" goto fim

echo.
echo Opção inválida. Tente novamente.
goto :eof

:iniciar
call "scripts\iniciar_sistema.bat"
goto fim

:compilar
call "scripts\build.bat"
goto fim

:limpar
call "scripts\limpar_temporarios.bat"
goto fim

:implantar
call "scripts\deploy.bat"
goto fim

:fim
echo.
exit /b