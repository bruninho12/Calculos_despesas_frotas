# Integração com Power BI

Este documento descreve como criar e usar templates do Power BI com o Sistema de Gestão de Frotas.

## Criando um Template Power BI

1. **Abra o Power BI Desktop**

   - Se não tiver, baixe em [https://powerbi.microsoft.com/desktop/](https://powerbi.microsoft.com/desktop/)

2. **Conecte-se aos dados de exemplo**

   - Use "Obter dados" > "Excel"
   - Selecione uma planilha processada pelo sistema

3. **Crie suas visualizações**

   - Dashboards para custos por frota
   - Gráficos de consumo de combustível
   - KPIs de performance
   - Mapas de rotas (se disponível)
   - Análises temporais de custos

4. **Salve como Template (.pbit)**

   - Arquivo > Salvar como
   - Escolha "Template do Power BI (\*.pbit)"

5. **Adicione o template ao sistema**
   - Coloque o arquivo .pbit na pasta: `backend/app/static/templates/frotas_template.pbit`

## Usando o Template (Para Usuários)

1. **Processe suas planilhas normalmente no sistema**

2. **Na tela de resultados, você terá três opções:**

   - Baixar a planilha Excel
   - Baixar o template Power BI
   - Baixar um pacote ZIP com ambos os arquivos

3. **Para usar o template:**

   - Clique duas vezes no arquivo .pbit
   - Quando solicitado, selecione a planilha Excel baixada
   - O Power BI carregará os dados e exibirá as visualizações

4. **Personalize conforme necessário**
   - Você pode modificar os gráficos e análises
   - Salve uma cópia local para manter suas alterações

## Exemplos de Visualizações Recomendadas

- **Dashboard de Custos por Frota**

  - Gráfico de barras com custos totais por veículo
  - Filtros por período e tipo de despesa

- **Análise de Consumo**

  - Gráfico de linha mostrando KM/L ao longo do tempo
  - Comparativo entre veículos similares

- **Mapa de Calor de Manutenção**

  - Identificação de veículos com mais problemas
  - Frequência de manutenções por tipo

- **Relatório de KPIs**
  - Custo por quilômetro
  - Eficiência de combustível
  - Tempo de inatividade
  - Custos de manutenção vs. valor do veículo

## Suporte

Caso tenha problemas com o template Power BI, entre em contato com o administrador do sistema.
