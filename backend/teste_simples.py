import pandas as pd
import os

# Criar dados de exemplo para simulação
data_custos = {
    'NUM_FROTA': [1001, 1001, 1002, 1002, 1003],
    'DTA_MOVIMENTO': ['2025-01-01', '2025-01-15', '2025-01-01', '2025-01-20', '2025-01-10'],
    'DSC_ITEMTABELA': ['Combustíveis e Lubrificantes', 'Pedágio', 'Viagens', 'Combustíveis e Lubrificantes', 'Pedágio'],
    'VLR_TOT_ITEM': [100.50, 20.00, 250.75, 150.30, 15.00]
}

data_frotas = {
    'NUM_FROTA': [1001, 1002, 1003, 1004],
    'ANO_MODELO_VEICULO': [2020, 2021, 2019, 2022],
    'DSC_MARCA': ['Toyota', 'Ford', 'Chevrolet', 'Honda'],
    'DSC_TIPO': ['Sedan', 'SUV', 'Hatch', 'Sedan']
}

# Criar DataFrames
df_custos = pd.DataFrame(data_custos)
df_frotas = pd.DataFrame(data_frotas)

# Salvar em arquivos temporários
caminho_custos = 'custos_teste.xlsx'
caminho_frotas = 'frotas_teste.xlsx'
caminho_saida = 'resultado_teste.xlsx'

df_custos.to_excel(caminho_custos, index=False)
df_frotas.to_excel(caminho_frotas, index=False)

print("Arquivos de teste criados com sucesso!")

# Processar os arquivos usando a lógica do organiza_frotas.py
# Normaliza datas e extrai mês
if 'DTA_MOVIMENTO' in df_custos.columns:
    df_custos['Mês'] = pd.to_datetime(df_custos['DTA_MOVIMENTO']).dt.strftime('%m/%Y')
else:
    df_custos['Mês'] = ''

# Junta custos com dados da frota
dados = pd.merge(df_custos, df_frotas, on='NUM_FROTA', how='left')

# Pivot para organizar por tipo de gasto
if 'DSC_ITEMTABELA' in dados.columns:
    tabela = dados.pivot_table(index=['Mês', 'NUM_FROTA', 'ANO_MODELO_VEICULO', 'DSC_MARCA', 'DSC_TIPO'],
                              columns='DSC_ITEMTABELA',
                              values='VLR_TOT_ITEM',
                              aggfunc='sum',
                              fill_value=0).reset_index()
else:
    tabela = dados

# Renomeia colunas para facilitar
colunas_renomeadas = {
    'Combustíveis e Lubrificantes': 'Combustível',
    'Pedágio': 'Pedágios',
    'Viagens': 'Viagens e Estadias',
}
tabela = tabela.rename(columns=colunas_renomeadas)

# Calcula o total de despesas
colunas_despesas = [col for col in tabela.columns if col not in ['Mês', 'NUM_FROTA', 'ANO_MODELO_VEICULO', 'DSC_MARCA', 'DSC_TIPO']]
tabela['Total Despesas'] = tabela[colunas_despesas].sum(axis=1)

# Reordena as colunas para colocar Total Despesas após Viagens e Estadias
todas_colunas = list(tabela.columns)
if 'Viagens e Estadias' in todas_colunas:
    if 'Total Despesas' in todas_colunas:
        todas_colunas.remove('Total Despesas')
    pos_viagens = todas_colunas.index('Viagens e Estadias')
    todas_colunas.insert(pos_viagens + 1, 'Total Despesas')
    tabela = tabela[todas_colunas]

# Salva a planilha organizada
tabela.to_excel(caminho_saida, index=False)

print(f'Planilha organizada salva em: {os.path.abspath(caminho_saida)}')

# Verificar a estrutura da planilha gerada
resultado = pd.read_excel(caminho_saida)

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

# Limpar arquivos temporários
#os.remove(caminho_custos)
#os.remove(caminho_frotas)
#os.remove(caminho_saida)

print("\nScript de teste concluído!")
