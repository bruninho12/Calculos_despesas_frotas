import React, { useState } from "react";
import "./App.css";
import ProcessarKM from "./components/ProcessarKM";

function PreviewTable({ data, title }) {
  if (!data || !data.primeiras_linhas || data.primeiras_linhas.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "20px", overflowX: "auto" }}>
      <h4 style={{ fontSize: "16px", color: "#333", marginBottom: "8px" }}>
        {title}
      </h4>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}
      >
        <thead>
          <tr>
            {data.colunas.map((coluna, index) => (
              <th
                key={index}
                style={{
                  padding: "8px",
                  backgroundColor: "#f2f2f2",
                  border: "1px solid #ddd",
                  fontWeight: "600",
                  textAlign: "left",
                }}
              >
                {coluna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.primeiras_linhas.map((linha, rowIndex) => (
            <tr key={rowIndex}>
              {data.colunas.map((coluna, colIndex) => (
                <td
                  key={colIndex}
                  style={{
                    padding: "8px",
                    border: "1px solid #ddd",
                    textAlign:
                      typeof linha[coluna] === "number" ? "right" : "left",
                  }}
                >
                  {linha[coluna] !== null && linha[coluna] !== undefined
                    ? String(linha[coluna])
                    : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "10px", fontSize: "13px", color: "#666" }}>
        <p>Total de linhas: {data.num_linhas}</p>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {Object.entries(data.estatisticas || {}).map(([key, value], i) => (
            <span key={i}>
              {key.replace(/_/g, " ")}: {value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CorrespondenciaInfo({ data }) {
  if (!data) return null;

  const getStatusBadge = (text, color) => (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        backgroundColor: color,
        color: "white",
        borderRadius: "4px",
        marginRight: "4px",
        fontSize: "12px",
      }}
    >
      {text}
    </span>
  );

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "12px",
        backgroundColor: "#f8f9fa",
        borderRadius: "4px",
        border: "1px solid #e9ecef",
      }}
    >
      <h4 style={{ fontSize: "16px", color: "#333", marginBottom: "8px" }}>
        Correspondência de Frotas
      </h4>
      <div style={{ fontSize: "14px", marginBottom: "8px" }}>
        <strong>Frotas em ambos arquivos:</strong> {data.frotas_em_ambos.length}
      </div>
      <div
        style={{
          fontSize: "14px",
          marginBottom: "8px",
          color: data.frotas_apenas_custos.length > 0 ? "#dc3545" : "#212529",
        }}
      >
        <strong>Frotas apenas na planilha de custos:</strong>{" "}
        {data.frotas_apenas_custos.length > 0
          ? data.frotas_apenas_custos.map((frota) => (
              <span key={frota}>{getStatusBadge(frota, "#dc3545")}</span>
            ))
          : "Nenhuma"}
      </div>
      <div
        style={{
          fontSize: "14px",
          color: data.frotas_apenas_cadastro.length > 0 ? "#ffc107" : "#212529",
        }}
      >
        <strong>Frotas apenas no cadastro:</strong>{" "}
        {data.frotas_apenas_cadastro.length > 0
          ? data.frotas_apenas_cadastro.map((frota) => (
              <span key={frota}>{getStatusBadge(frota, "#ffc107")}</span>
            ))
          : "Nenhuma"}
      </div>
    </div>
  );
}

function App() {
  const [planilhaCustos, setPlanilhaCustos] = useState(null);
  const [relacaoFrotas, setRelacaoFrotas] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  // Estado para navegação entre telas
  const [telaAtual, setTelaAtual] = useState("inicial");
  // Estado para armazenar a planilha processada para a segunda etapa
  const [planilhaProcessada, setPlanilhaProcessada] = useState(null);
  const [previewData, setPreviewData] = useState({
    custos: null,
    frotas: null,
    custoNome: null,
    frotasNome: null,
    correspondencia: null,
    mostrarPrevia: false,
  });

  const handleSelectFile = (e, type) => {
    if (e.target.files && e.target.files.length > 0) {
      const arquivo = e.target.files[0];
      setErro("");

      if (type === "custos") {
        setPlanilhaCustos(arquivo);
        // Apenas armazenamos o nome do arquivo para exibição, não para renderização no componente PreviewTable
        setPreviewData((prev) => ({
          ...prev,
          custos: null,
          custoNome: arquivo.name,
        }));
      } else {
        setRelacaoFrotas(arquivo);
        // Apenas armazenamos o nome do arquivo para exibição, não para renderização no componente PreviewTable
        setPreviewData((prev) => ({
          ...prev,
          frotas: null,
          frotasNome: arquivo.name,
        }));
      }
    }

    // Reset exibição da prévia quando novos arquivos são selecionados
    setPreviewData((prev) => ({ ...prev, mostrarPrevia: false }));

    if (type === "custos") {
      if (e.target.files.length === 0) {
        setPlanilhaCustos(null);
        setPreviewData((prev) => ({ ...prev, custos: null, custoNome: null }));
      }
    } else if (type === "frotas") {
      if (e.target.files.length === 0) {
        setRelacaoFrotas(null);
        setPreviewData((prev) => ({ ...prev, frotas: null, frotasNome: null }));
      }
    }
  };

  const carregarPrevia = async () => {
    if (!planilhaCustos || !relacaoFrotas) {
      setErro("Selecione ambas as planilhas para visualizar a prévia.");
      return;
    }

    setCarregando(true);
    setErro("");
    setMensagem("Carregando prévia dos dados...");

    const formData = new FormData();
    formData.append("planilha_custos", planilhaCustos);
    formData.append("relacao_frotas", relacaoFrotas);

    const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

    try {
      const response = await fetch(`${API_BASE_URL}/previa-dados/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setPreviewData({
          ...previewData,
          ...data.previa,
          mostrarPrevia: true,
        });
        setMensagem("Prévia carregada com sucesso!");
      } else {
        setErro(data.message || "Erro ao carregar prévia dos dados.");
      }
    } catch (err) {
      setErro(`Erro ao conectar com o servidor: ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    // Verificação mais robusta dos arquivos
    if (!planilhaCustos) {
      setErro("Selecione a Planilha de Custos.");
      return;
    }

    if (!relacaoFrotas) {
      setErro("Selecione a Relação de Frotas.");
      return;
    }

    console.log("Enviando arquivos:", planilhaCustos.name, relacaoFrotas.name);

    setCarregando(true);
    const formData = new FormData();

    // Importante: os nomes dos campos devem corresponder exatamente ao que o backend espera
    formData.append("planilha_custos", planilhaCustos, planilhaCustos.name);
    formData.append("relacao_frotas", relacaoFrotas, relacaoFrotas.name);

    // Log detalhado do FormData
    console.log("FormData - planilha_custos:", planilhaCustos.name);
    console.log("FormData - relacao_frotas:", relacaoFrotas.name);

    try {
      // Teste de conectividade com o backend
      const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";
      try {
        console.log("Testando conexão com o backend...");
        await fetch(`${API_BASE_URL}/teste/`)
          .then((response) => {
            console.log("Resposta do teste:", response.status);
            if (!response.ok) {
              console.error("Backend não está respondendo corretamente!");
            } else {
              console.log("Backend respondeu com sucesso!");
            }
          })
          .catch((err) => {
            console.error("Erro ao conectar ao backend:", err);
          });
      } catch (testError) {
        console.error("Erro ao testar conexão:", testError);
      }

      const url = `${API_BASE_URL}/processar-planilhas/`;
      console.log("URL da requisição:", url);

      // Usando XMLHttpRequest para acompanhar o progresso do upload
      const xhr = new XMLHttpRequest();

      // Configurar a requisição
      xhr.open("POST", url, true);

      // Configurar eventos para acompanhar o progresso
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleto = Math.round(
            (event.loaded * 100) / event.total
          );
          setProgresso(percentCompleto);
          console.log(`Progresso do upload: ${percentCompleto}%`);
        }
      };

      // Promisificar o XMLHttpRequest
      const response = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              ok: true,
              blob: () => Promise.resolve(xhr.response),
              json: () => Promise.resolve(JSON.parse(xhr.responseText)),
            });
          } else {
            resolve({
              ok: false,
              status: xhr.status,
              statusText: xhr.statusText,
              json: () => Promise.resolve(JSON.parse(xhr.responseText)),
            });
          }
        };

        xhr.onerror = () => {
          reject(new Error("Erro de rede ao enviar os arquivos"));
        };

        // Configurar para receber como blob para download
        xhr.responseType = "blob";

        // Enviar a requisição
        xhr.send(formData);
      });
      if (response.ok) {
        // Baixar o arquivo retornado
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Criar um File object a partir do blob para usar na próxima etapa
        try {
          const planilhaFile = new File([blob], "planilha_organizada.xlsx", {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            lastModified: new Date().getTime(),
          });

          // Verificar se o objeto File foi criado corretamente
          if (planilhaFile instanceof File) {
            console.log(
              "File object criado com sucesso:",
              planilhaFile.name,
              "tamanho:",
              planilhaFile.size
            );

            // Armazenar a planilha processada para uso na segunda etapa
            setPlanilhaProcessada(planilhaFile);
          } else {
            console.error("Falha ao criar objeto File");
            setErro(
              "Falha ao preparar arquivo para a próxima etapa. Por favor, tente novamente."
            );
          }
        } catch (fileError) {
          console.error("Erro ao criar File object:", fileError);
          setErro(
            "Erro ao preparar arquivo para a próxima etapa: " +
              fileError.message
          );
        }

        // Download automático
        const a = document.createElement("a");
        a.href = url;
        a.download = "planilha_organizada.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        setMensagem(
          "Processamento concluído! O download foi iniciado. Você pode prosseguir para a próxima etapa."
        );

        // Navegar para a segunda tela após 2 segundos
        setTimeout(() => {
          setTelaAtual("processar-km");
        }, 2000);
      } else {
        // Tentar extrair mensagem de erro
        try {
          const data = await response.json();
          // Garante que o erro seja uma string legível
          const mensagemErro =
            data && typeof data.detail === "object"
              ? JSON.stringify(data.detail)
              : data && data.detail
              ? String(data.detail)
              : "Erro ao processar as planilhas.";
          setErro(mensagemErro);
        } catch (parseErr) {
          setErro("Erro ao processar as planilhas.");
        }
      }
    } catch (err) {
      // Garante que o erro da exceção seja uma string
      setErro(
        err && err.message ? err.message : "Erro de conexão com o servidor."
      );
    }
    setCarregando(false);
  };

  // Esta função de teste foi removida pois não estava sendo utilizada

  // Função para voltar para a tela inicial
  const voltarParaInicial = () => {
    setTelaAtual("inicial");
  };

  // Função para avançar para a tela de processamento de KM
  const irParaProcessarKM = () => {
    if (planilhaProcessada) {
      setTelaAtual("processar-km");
    } else {
      setErro("Você precisa processar as planilhas iniciais primeiro!");
    }
  };

  return (
    <div
      className="App"
      style={{ minHeight: "100vh", background: "#fff", padding: "1rem" }}
    >
      {telaAtual === "processar-km" ? (
        <>
          <button
            onClick={voltarParaInicial}
            style={{
              padding: "8px 15px",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
            }}
          >
            ← Voltar para processamento inicial
          </button>
          <ProcessarKM planilhaOrganizada={planilhaProcessada} />
        </>
      ) : (
        <>
          <h1
            style={{ textAlign: "center", marginBottom: 16, color: "#1976d2" }}
          >
            Sistema de Processamento de Planilhas de Frotas
          </h1>
          <p style={{ textAlign: "center", marginBottom: 20, color: "#555" }}>
            Faça upload dos arquivos para processamento automático
          </p>
          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: 500,
              margin: "0 auto",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 24,
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{ fontSize: "1.1rem", color: "#333", marginBottom: 10 }}
              >
                Planilha de Custos
              </h3>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleSelectFile(e, "custos")}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              {previewData.custos && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Arquivo selecionado: {previewData.custoNome}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{ fontSize: "1.1rem", color: "#333", marginBottom: 10 }}
              >
                Relação de Frotas
              </h3>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleSelectFile(e, "frotas")}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
              {previewData.frotas && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "8px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Arquivo selecionado: {previewData.frotasNome}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button
                type="button"
                disabled={carregando || !planilhaCustos || !relacaoFrotas}
                onClick={carregarPrevia}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor:
                    planilhaCustos && relacaoFrotas && !carregando
                      ? "pointer"
                      : "not-allowed",
                  opacity:
                    planilhaCustos && relacaoFrotas && !carregando ? 1 : 0.7,
                }}
              >
                Visualizar Prévia
              </button>
              <button
                type="submit"
                disabled={carregando}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: !carregando ? "pointer" : "not-allowed",
                }}
              >
                {carregando ? "Processando..." : "Processar Planilhas"}
              </button>
            </div>

            {carregando && (
              <div style={{ margin: "15px 0" }}>
                <div
                  style={{
                    height: "8px",
                    backgroundColor: "#e9ecef",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progresso}%`,
                      backgroundColor: "#007bff",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6c757d",
                    textAlign: "center",
                    marginTop: "5px",
                  }}
                >
                  {progresso}% Concluído
                </div>
              </div>
            )}

            {erro && (
              <div
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  borderRadius: "4px",
                  marginBottom: "15px",
                  fontSize: "14px",
                }}
              >
                <b>Erro!</b> {erro}
              </div>
            )}
            {mensagem && (
              <div
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#d4edda",
                  color: "#155724",
                  borderRadius: "4px",
                  marginBottom: "15px",
                  fontSize: "14px",
                }}
              >
                {mensagem}
              </div>
            )}

            {/* Botão para ir para a segunda etapa - visível apenas se houver uma planilha processada */}
            {planilhaProcessada && (
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={irParaProcessarKM}
                  style={{
                    padding: "12px 20px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Avançar para Processamento de KM Rodados →
                </button>
              </div>
            )}

            {/* Área de prévia dos dados */}
            {previewData.mostrarPrevia && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "15px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  border: "1px solid #dee2e6",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    color: "#007bff",
                    marginBottom: "15px",
                  }}
                >
                  Prévia dos Dados
                </h3>

                {/* Correspondência entre as planilhas */}
                {previewData.correspondencia && (
                  <CorrespondenciaInfo data={previewData.correspondencia} />
                )}

                {/* Prévia da planilha de custos */}
                {previewData.custos &&
                  typeof previewData.custos === "object" &&
                  previewData.custos.primeiras_linhas && (
                    <PreviewTable
                      data={previewData.custos}
                      title="Planilha de Custos"
                    />
                  )}

                {/* Prévia da planilha de frotas */}
                {previewData.frotas &&
                  typeof previewData.frotas === "object" &&
                  previewData.frotas.primeiras_linhas && (
                    <PreviewTable
                      data={previewData.frotas}
                      title="Relação de Frotas"
                    />
                  )}
              </div>
            )}
          </form>
          <div
            style={{
              maxWidth: "500px",
              margin: "30px auto 0",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "15px",
              backgroundColor: "#f8f9fa",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                color: "#007bff",
                marginBottom: "10px",
              }}
            >
              Como funciona?
            </h2>
            <ol
              style={{ paddingLeft: "25px", color: "#333", fontSize: "15px" }}
            >
              <li>
                Faça upload da <strong>planilha de custos</strong>
              </li>
              <li>
                Faça upload da <strong>relação de frotas</strong>
              </li>
              <li>
                Clique em <strong>Visualizar Prévia</strong> para verificar os
                dados
              </li>
              <li>Verifique se as frotas correspondem entre as planilhas</li>
              <li>
                Se tudo estiver correto, clique em{" "}
                <strong>Processar Planilhas</strong>
              </li>
              <li>Aguarde o download do arquivo processado</li>
              <li>
                Após o processamento, você poderá avançar para a{" "}
                <strong>Segunda Etapa</strong> para processar KM rodados
              </li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
