# Instruções para Criar e Usar Templates do Power BI

## IMPORTANTE: O ARQUIVO .PBIT NÃO PODE SER CRIADO MANUALMENTE

Os arquivos .pbit (Template do Power BI) são arquivos binários especiais que só podem ser criados 
usando o Power BI Desktop. Criar ou modificar manualmente este arquivo resultará no erro 
"O arquivo está criptografado ou corrompido".

## Criando um Template do Power BI Válido

Para criar um template do Power BI adequado para os dados de frota:

1. Baixe e instale o Power BI Desktop em: https://powerbi.microsoft.com/desktop/

2. Abra o Power BI Desktop e crie um novo relatório

3. Importe dados de exemplo:
   - Use "Obter dados" > "Excel" no menu superior
   - Selecione uma planilha de exemplo gerada pelo sistema

4. Crie visualizações relevantes, como:
   - Gráfico de barras para custos por veículo
   - Gráfico de linha para KM rodados ao longo do tempo
   - Cartões com KPIs (média de consumo, custo/km)
   - Tabela detalhada com informações de despesas

5. Salve como template (.pbit):
   - Arquivo > Salvar como
   - Selecione "Template do Power BI (*.pbit)"
   - Salve com o nome "frotas_template.pbit"

6. Coloque o arquivo na pasta:
   backend/app/static/templates/frotas_template.pbit

## Usando um Template do Power BI

1. Baixe o template (.pbit) e a planilha Excel gerada pelo sistema

2. Dê dois cliques no arquivo .pbit para abri-lo no Power BI Desktop

3. Quando solicitado, navegue até a planilha Excel baixada

4. O Power BI carregará automaticamente os dados e aplicará as visualizações

5. Agora você pode analisar seus dados com recursos visuais avançados

## Solução de Problemas

Se você encontrar o erro "O arquivo está criptografado ou corrompido":

1. Certifique-se de ter criado o arquivo .pbit usando o Power BI Desktop
2. Nunca modifique o arquivo .pbit manualmente
3. Tente criar um novo template do zero
4. Verifique se o arquivo não foi danificado durante o upload

## Enquanto não houver um arquivo .pbit válido

O sistema continuará funcionando normalmente, gerando apenas planilhas Excel.
O botão de download do Power BI entregará este arquivo de instruções.