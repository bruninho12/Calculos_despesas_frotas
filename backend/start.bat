@echo off
echo =====================================================================
echo  Sistema de Processamento de Planilhas - Backend
echo =====================================================================

cd %~dp0

echo [1/3] Verificando ambiente Python...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Python não encontrado! Por favor, instale o Python 3.8 ou superior.
    goto :error
)

echo [2/3] Verificando dependências...
if not exist venv (
    echo Criando ambiente virtual Python...
    python -m venv venv
    call venv\Scripts\activate
    echo Instalando dependências...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

echo [3/3] Iniciando servidor FastAPI...
echo.
echo Backend disponível em: http://localhost:8000
echo.
python run.py
goto :end

:error
echo.
echo Falha na inicialização do backend.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul
exit /b 1

:end
