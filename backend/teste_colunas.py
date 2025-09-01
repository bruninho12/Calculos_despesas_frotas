import os
import sys
import pandas as pd

# Adiciona o diretório do projeto ao path para importação dos módulos
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Define os caminhos dos arquivos para teste
caminho_base = os.path.dirname(os.path.abspath(__file__))
caminho_custos = os.path.join(caminho_base, "data", "uploads", "CUSTO 01-01 A 31-05.xlsx")
caminho_frotas = os.path.join(caminho_base, "data", "uploads", "Relação de frotas.xlsx")
caminho_saida = os.path.join(caminho_base, "teste_saida.xlsx")

print(f"Arquivo de custos: {caminho_custos}")
print(f"Arquivo de frotas: {caminho_frotas}")

# Verifica se os arquivos existem
if not os.path.exists(caminho_custos):
    print(f"ERRO: Arquivo de custos não encontrado: {caminho_custos}")
    sys.exit(1)

if not os.path.exists(caminho_frotas):
    print(f"ERRO: Arquivo de frotas não encontrado: {caminho_frotas}")
    sys.exit(1)

# Importa o script organiza_frotas.py
from app.scripts.organiza_frotas import *

# O script já foi executado no import, agora vamos verificar a estrutura do arquivo gerado
print("\nVerificando o arquivo gerado...")
resultado = pd.read_excel(caminho_saida)

# Exibe as primeiras linhas e as colunas
print("\nColunas do arquivo gerado:")
print(list(resultado.columns))

print("\nPrimeiras linhas:")
print(resultado.head())

print("\nVerificando se ANO_MODELO_VEICULO está entre NUM_FROTA e DSC_MARCA:")
colunas = list(resultado.columns)
if 'NUM_FROTA' in colunas and 'ANO_MODELO_VEICULO' in colunas and 'DSC_MARCA' in colunas:
    idx_frota = colunas.index('NUM_FROTA')
    idx_ano = colunas.index('ANO_MODELO_VEICULO')
    idx_marca = colunas.index('DSC_MARCA')
    
    if idx_frota < idx_ano < idx_marca:
        print("SUCESSO! ANO_MODELO_VEICULO está corretamente posicionado entre NUM_FROTA e DSC_MARCA")
    else:
        print("ERRO! A ordem das colunas não está correta:")
        print(f"NUM_FROTA: posição {idx_frota}")
        print(f"ANO_MODELO_VEICULO: posição {idx_ano}")
        print(f"DSC_MARCA: posição {idx_marca}")
else:
    print("ERRO! Uma ou mais colunas não foram encontradas no arquivo gerado")

print("\nScript de teste concluído!")
