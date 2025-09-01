import requests
import os

# URL base da API
BASE_URL = "http://localhost:8000"

# Função para testar o endpoint
def testar_upload(caminho_custos, caminho_frotas):
    url = f"{BASE_URL}/processar-planilhas/"
    
    # Verifica se os arquivos existem
    if not os.path.exists(caminho_custos):
        print(f"Erro: Arquivo de custos não encontrado: {caminho_custos}")
        return False
    
    if not os.path.exists(caminho_frotas):
        print(f"Erro: Arquivo de frotas não encontrado: {caminho_frotas}")
        return False
    
    # Prepara os arquivos para upload
    arquivos = {
        "planilha_custos": (os.path.basename(caminho_custos), open(caminho_custos, "rb"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
        "relacao_frotas": (os.path.basename(caminho_frotas), open(caminho_frotas, "rb"), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    }
    
    print("Enviando arquivos para:", url)
    print(f"- Arquivo de custos: {caminho_custos}")
    print(f"- Arquivo de frotas: {caminho_frotas}")
    
    response = requests.post(url, files=arquivos)
    
    print("Status:", response.status_code)
    if response.status_code == 200:
        print("Sucesso!")
        # Salvar o arquivo retornado
        with open("resultado.xlsx", "wb") as f:
            f.write(response.content)
        print("Arquivo salvo como resultado.xlsx")
        return True
    else:
        print("Erro:", response.text)
        return False

# Primeiro testar o endpoint de teste
def testar_endpoint_teste():
    url = f"{BASE_URL}/teste/"
    print("Testando endpoint:", url)
    try:
        response = requests.get(url)
        print("Status:", response.status_code)
        print("Resposta:", response.text)
        return response.status_code == 200
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão: {e}")
        return False

if __name__ == "__main__":
    # Primeiro testar se o servidor está respondendo
    if not testar_endpoint_teste():
        print("Não foi possível conectar ao servidor. Verifique se a API está em execução.")
        exit(1)
    
    # Caminho para os arquivos de teste
    caminho_base = os.path.dirname(os.path.abspath(__file__))
    pasta_dados = os.path.join(caminho_base, "..", "data")
    
    caminho_custos = os.path.join(pasta_dados, "uploads", "CUSTO 01-01 A 31-05.xlsx")
    caminho_frotas = os.path.join(pasta_dados, "uploads", "Relação de frotas.xlsx")
    
    # Verificar se os arquivos de teste existem antes de testar o upload
    if not (os.path.exists(caminho_custos) and os.path.exists(caminho_frotas)):
        print("Arquivos de teste não encontrados. Verifique os caminhos:")
        print(f"- {caminho_custos}")
        print(f"- {caminho_frotas}")
        exit(1)
    
    testar_upload(caminho_custos, caminho_frotas)
