@echo off
echo Limpando arquivos temporários e organizando diretórios...

REM Mover arquivos Excel para a pasta dados-exemplo
if not exist dados-exemplo mkdir dados-exemplo
move /Y "*.xlsx" "dados-exemplo\" 2>nul
echo Arquivos Excel movidos para a pasta dados-exemplo.

REM Remover diretório __pycache__
if exist __pycache__ (
    rmdir /S /Q __pycache__
    echo Diretório __pycache__ removido.
)

echo Limpeza concluída!
pause
