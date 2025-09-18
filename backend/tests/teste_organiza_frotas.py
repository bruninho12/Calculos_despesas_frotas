import os
import sys

# Adiciona o diretório do projeto ao path para importação dos módulos
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Importa o script diretamente
from app.scripts.organiza_frotas import *

print("Script de teste executado com sucesso!")
print(f"Planilha gerada em: {os.path.abspath(caminho_saida)}")
