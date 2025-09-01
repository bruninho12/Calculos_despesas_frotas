import React, { useState } from "react";

// URL base para a API - em produção, isso será substituído pela URL real do servidor
// Em produção, use um valor relativo como "/api" ou uma variável de ambiente
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

function ProcessarKM({ planilhaOrganizada }) {
  // Debug para verificar o que está sendo recebido como planilhaOrganizada
  console.log(
    "ProcessarKM recebeu planilhaOrganizada:",
    planilhaOrganizada instanceof File
      ? {
          name: planilhaOrganizada.name,
          size: planilhaOrganizada.size,
          type: planilhaOrganizada.type,
        }
      : planilhaOrganizada
  );
  const [planilhaKM, setPlanilhaKM] = useState(null);
  const [planilhaKMNome, setPlanilhaKMNome] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [previewData, setPreviewData] = useState({
    km: null,
    organizada: null,
    mostrarPrevia: false,
  });

  const handleSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const arquivo = e.target.files[0];
      setErro("");
      setPlanilhaKM(arquivo);
      setPlanilhaKMNome(arquivo.name);
      setPreviewData((prev) => ({ ...prev, mostrarPrevia: false }));
    } else {
      setPlanilhaKM(null);
      setPlanilhaKMNome(null);
    }
  };

  const carregarPrevia = async () => {
    if (!planilhaKM || !planilhaOrganizada) {
      setErro("Selecione a planilha de KM rodados para visualizar a prévia.");
      return;
    }

    // Verifica se planilhaOrganizada é um objeto File válido
    if (!(planilhaOrganizada instanceof File)) {
      setErro(
        "Planilha organizada não é válida. Por favor, reinicie o processo."
      );
      console.error(
        "planilhaOrganizada não é um objeto File:",
        planilhaOrganizada
      );
      return;
    }

    setCarregando(true);
    setErro("");
    setMensagem("Carregando prévia dos dados de KM rodados...");

    const formData = new FormData();
    formData.append("planilha_km", planilhaKM);
    formData.append("planilha_organizada", planilhaOrganizada);

    // Log para debug
    console.log("Enviando para prévia - planilha_km:", planilhaKM.name);
    console.log(
      "Enviando para prévia - planilha_organizada:",
      planilhaOrganizada.name
    );

    try {
      const response = await fetch(`${API_BASE_URL}/previa-km/`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        if (data.status === "success") {
          setPreviewData({
            ...previewData,
            ...data.previa,
            mostrarPrevia: true,
          });
          setMensagem("Prévia carregada com sucesso!");
        } else {
          setErro(data.message || "Erro ao carregar prévia dos dados de KM.");
        }
      } else {
        try {
          // Tentar ler o erro como texto
          const errorText = await response.text();
          let errorMessage = `Erro ${response.status}: ${response.statusText}`;

          try {
            // Tentar interpretar o texto como JSON
            const errorData = JSON.parse(errorText);
            if (errorData.detail) {
              errorMessage = errorData.detail;
            } else if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (jsonError) {
            // Se não for JSON válido, usar o texto como está
            if (errorText) {
              errorMessage = errorText;
            }
          }

          setErro(errorMessage);
        } catch (parseErr) {
          setErro(`Erro ${response.status}: ${response.statusText}`);
        }
      }
    } catch (err) {
      setErro(`Erro ao conectar com o servidor: ${err.message}`);
      console.error("Erro na requisição de prévia:", err);
    } finally {
      setCarregando(false);
    }
  };

  const processarDados = async () => {
    if (!planilhaKM || !planilhaOrganizada) {
      setErro("Selecione a planilha de KM rodados para continuar.");
      return;
    }

    // Verifica se planilhaOrganizada é um objeto File válido
    if (!(planilhaOrganizada instanceof File)) {
      setErro(
        "Planilha organizada não é válida. Por favor, reinicie o processo."
      );
      console.error(
        "planilhaOrganizada não é um objeto File:",
        planilhaOrganizada
      );
      return;
    }

    setCarregando(true);
    setErro("");
    setMensagem("Processando dados...");

    const formData = new FormData();
    formData.append("planilha_km", planilhaKM);
    formData.append("planilha_organizada", planilhaOrganizada);

    // Log para debug
    console.log("Enviando planilha_km:", planilhaKM.name);
    console.log("Enviando planilha_organizada:", planilhaOrganizada.name);

    try {
      // Sempre pular validação de colunas, pois estamos calculando os valores dinamicamente
      const url = `${API_BASE_URL}/processar-km/?skip_validation=true`;

      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Para arquivos Excel, tratamos como blob para download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const filename =
          response.headers
            .get("Content-Disposition")
            ?.split("filename=")[1]
            ?.replace(/"/g, "") || "planilha_completa.xlsx";

        // Iniciar download automático
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();

        setMensagem(
          "Processamento concluído com sucesso! O download foi iniciado."
        );
        setResultado({
          download_url: url,
          filename: filename,
          registros_processados: "Processamento concluído",
        });
      } else {
        try {
          // Tentar ler o erro como texto
          const errorText = await response.text();
          let errorMessage = `Erro ${response.status}: ${response.statusText}`;

          try {
            // Tentar interpretar o texto como JSON
            const errorData = JSON.parse(errorText);
            if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (jsonError) {
            // Se não for JSON válido, usar o texto como está
            if (errorText) {
              errorMessage = errorText;
            }
          }

          setErro(errorMessage);
        } catch (parseErr) {
          setErro(`Erro ${response.status}: ${response.statusText}`);
        }
      }
    } catch (err) {
      setErro(`Erro ao conectar com o servidor: ${err.message}`);
      console.error("Erro na requisição:", err);
    } finally {
      setCarregando(false);
      window.URL.revokeObjectURL(resultado?.download_url);
    }
  };

  // Componente para exibir a tabela de prévia
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
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
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
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
          <p>
            Total de linhas: {data.num_linhas} | Mostrando as primeiras{" "}
            {data.primeiras_linhas.length} linhas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">Processar Planilha KM Rodados</h1>
      <p className="description">
        Faça upload da planilha com os dados de KM rodados e consumo para
        complementar a análise da planilha organizada.
      </p>

      {erro && (
        <div className="error-message">
          <strong>Erro:</strong> {erro}
          {erro.includes("Colunas") && (
            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              <p>
                <strong>Informação:</strong> O sistema agora foi atualizado para
                calcular automaticamente as métricas necessárias a partir dos
                dados brutos.
              </p>
              <p>
                <strong>Colunas necessárias na planilha:</strong>
              </p>
              <ul style={{ marginLeft: "20px", marginTop: "5px" }}>
                <li>
                  <strong>NUM_FROTA</strong> - Identificador da frota
                </li>
                <li>
                  <strong>KM_ATUAL</strong> - Quilometragem atual no momento do
                  registro
                </li>
                <li>
                  <strong>DTA_MOVIMENTO</strong> - Data do registro
                </li>
                <li>
                  <strong>QTDE_ITEM</strong> - (opcional) Para calcular litros
                  consumidos
                </li>
                <li>
                  <strong>DSC_TIPO_DESPESAS</strong> - (opcional) Para
                  identificar abastecimentos
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
      {mensagem && <div className="success-message">{mensagem}</div>}

      <form className="upload-form">
        <div className="file-input-container">
          <label className="file-input-label">
            <span>Planilha de KM Rodados</span>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleSelectFile}
                className="file-input"
              />
              <span className="file-input-button">Selecionar Arquivo</span>
            </div>
            {planilhaKMNome && (
              <div className="selected-file">
                Arquivo selecionado: {planilhaKMNome}
              </div>
            )}
          </label>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            Envie sua planilha com dados de KM. O sistema calculará
            automaticamente:
            <ul style={{ marginTop: "5px", paddingLeft: "15px" }}>
              <li>
                <strong>Km Rodados Mês:</strong> Diferença entre KM máximo e
                mínimo por frota/mês
              </li>
              <li>
                <strong>Qtd Litros Consumidos:</strong> Soma dos abastecimentos
                por frota/mês
              </li>
              <li>
                <strong>Custo / Km Rodado:</strong> Total Despesas dividido
                pelos KM rodados
              </li>
              <li>
                <strong>Média Consumo:</strong> KM rodados dividido pela
                quantidade de litros
              </li>
            </ul>
          </div>
        </div>{" "}
        <div className="info-box">
          <div className="info-icon">ℹ️</div>
          <div className="info-content">
            <strong>Planilha organizada já selecionada:</strong>{" "}
            {planilhaOrganizada && planilhaOrganizada instanceof File
              ? planilhaOrganizada.name
              : planilhaOrganizada
              ? "Arquivo inválido (recarregue a página)"
              : "Nenhuma"}
          </div>
        </div>
        <div className="buttons-container">
          <button
            type="button"
            onClick={carregarPrevia}
            disabled={carregando || !planilhaKM || !planilhaOrganizada}
            className="preview-button"
          >
            Visualizar Prévia
          </button>
          <button
            type="button"
            onClick={processarDados}
            disabled={carregando || !planilhaKM || !planilhaOrganizada}
            className="process-button"
          >
            Processar Planilhas
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!planilhaKM || !planilhaOrganizada) {
                setErro("Selecione ambas as planilhas para testar o upload.");
                return;
              }
              setCarregando(true);
              setErro("");
              setMensagem("Testando upload de arquivos...");

              const formData = new FormData();
              formData.append("planilha_km", planilhaKM);
              formData.append("planilha_organizada", planilhaOrganizada);

              try {
                const response = await fetch(`${API_BASE_URL}/teste-upload/`, {
                  method: "POST",
                  body: formData,
                });

                if (response.ok) {
                  const data = await response.json();
                  setMensagem(
                    `Teste de upload bem-sucedido! Arquivos recebidos: ${
                      data.arquivos_recebidos.planilha_km.filename
                    } (${Math.round(
                      data.arquivos_recebidos.planilha_km.size / 1024
                    )}KB) e ${
                      data.arquivos_recebidos.planilha_organizada.filename
                    } (${Math.round(
                      data.arquivos_recebidos.planilha_organizada.size / 1024
                    )}KB)`
                  );
                } else {
                  const errorText = await response.text();
                  setErro(
                    `Erro no teste: ${response.status} ${response.statusText} - ${errorText}`
                  );
                }
              } catch (err) {
                setErro(`Erro no teste: ${err.message}`);
              } finally {
                setCarregando(false);
              }
            }}
            disabled={carregando || !planilhaKM || !planilhaOrganizada}
            className="test-button"
            style={{ marginLeft: "10px", backgroundColor: "#6c757d" }}
          >
            Testar Upload
          </button>
        </div>
        {carregando && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">Processando...</div>
          </div>
        )}
        {/* Área de visualização da prévia */}
        {previewData.mostrarPrevia && (
          <div className="preview-container">
            <h3>Prévia dos Dados</h3>

            {/* Prévia da planilha de KM */}
            {previewData.km &&
              typeof previewData.km === "object" &&
              previewData.km.primeiras_linhas && (
                <PreviewTable
                  data={previewData.km}
                  title="Planilha de KM Rodados"
                />
              )}

            {/* Prévia da planilha organizada */}
            {previewData.organizada &&
              typeof previewData.organizada === "object" &&
              previewData.organizada.primeiras_linhas && (
                <PreviewTable
                  data={previewData.organizada}
                  title="Planilha Organizada"
                />
              )}
          </div>
        )}
      </form>

      {/* Resultado do processamento */}
      {resultado && (
        <div className="result-container">
          <h3>Processamento Concluído</h3>
          <p>O arquivo com os dados processados está pronto para download.</p>
          <a href={resultado.download_url} download className="download-button">
            Baixar Planilha Final
          </a>
          <div className="result-info">
            <p>
              <strong>Nome do arquivo:</strong> {resultado.filename}
            </p>
            <p>
              <strong>Registros processados:</strong>{" "}
              {resultado.registros_processados}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcessarKM;
