import React, { useState } from "react";
import {
  Button,
  Box,
  Typography,
  LinearProgress,
  Grid,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ProcessarKM from "./components/ProcessarKM";
import Header from "./components/Header";
import UploadForm from "./components/UploadForm";
import Message from "./components/Message";
import DataTable from "./components/DataTable";
import CorrespondenciaInfo from "./components/CorrespondenciaInfo";
import {
  PageContainer,
  ContentContainer,
  StyledPaper,
} from "./components/StyledComponents";

function App() {
  const [planilhaCustos, setPlanilhaCustos] = useState(null);
  const [relacaoFrotas, setRelacaoFrotas] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [telaAtual, setTelaAtual] = useState("inicial");
  const [planilhaProcessada, setPlanilhaProcessada] = useState(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [previewData, setPreviewData] = useState({
    custos: null,
    frotas: null,
    custoNome: null,
    frotasNome: null,
    correspondencia: null,
    mostrarPrevia: false,
  });

  const handleSelectFile = (arquivo, type) => {
    if (arquivo) {
      setErro("");

      if (type === "custos") {
        setPlanilhaCustos(arquivo);
        setPreviewData((prev) => ({
          ...prev,
          custos: null,
          custoNome: arquivo.name,
        }));
      } else {
        setRelacaoFrotas(arquivo);
        setPreviewData((prev) => ({
          ...prev,
          frotas: null,
          frotasNome: arquivo.name,
        }));
      }
    }

    setPreviewData((prev) => ({ ...prev, mostrarPrevia: false }));
  };

  const carregarPrevia = async () => {
    if (!planilhaCustos || !relacaoFrotas) {
      setErro("Selecione ambas as planilhas para visualizar a prévia.");
      setMessageOpen(true);
      return;
    }

    setCarregando(true);
    setErro("");
    setMensagem("Carregando prévia dos dados...");
    setMessageOpen(true);

    const formData = new FormData();
    formData.append("planilha_custos", planilhaCustos);
    formData.append("relacao_frotas", relacaoFrotas);

    const API_BASE_URL = "https://frota-api-qro2.onrender.com";

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
      setMessageOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");

    if (!planilhaCustos) {
      setErro("Selecione a Planilha de Custos.");
      setMessageOpen(true);
      return;
    }

    if (!relacaoFrotas) {
      setErro("Selecione a Relação de Frotas.");
      setMessageOpen(true);
      return;
    }

    setCarregando(true);
    const formData = new FormData();
    formData.append("planilha_custos", planilhaCustos);
    formData.append("relacao_frotas", relacaoFrotas);

    const API_BASE_URL = "https://frota-api-qro2.onrender.com";

    try {
      const response = await fetch(`${API_BASE_URL}/processar-planilhas/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Erro ao processar as planilhas.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      try {
        const planilhaFile = new File([blob], "planilha_organizada.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          lastModified: new Date().getTime(),
        });

        if (planilhaFile instanceof File) {
          setPlanilhaProcessada(planilhaFile);
        } else {
          setErro("Falha ao preparar arquivo para a próxima etapa.");
        }
      } catch (fileError) {
        setErro(
          "Erro ao preparar arquivo para a próxima etapa: " + fileError.message
        );
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "planilha_organizada.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMensagem("Processamento concluído! O download foi iniciado.");
      setTimeout(() => setTelaAtual("processar-km"), 2000);
    } catch (err) {
      setErro(err?.message || "Erro de conexão com o servidor.");
    }
    setCarregando(false);
    setMessageOpen(true);
  };

  const voltarParaInicial = () => setTelaAtual("inicial");

  const irParaProcessarKM = () => {
    if (planilhaProcessada) {
      setTelaAtual("processar-km");
    } else {
      setErro("Você precisa processar as planilhas iniciais primeiro!");
      setMessageOpen(true);
    }
  };

  const handleCloseMessage = () => setMessageOpen(false);

  return (
    <PageContainer>
      <Header />
      <Box
        sx={{
          backgroundColor: "#2a79b9",
          padding: "20px",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <Box
            component="img"
            src="/truck-icon.png"
            alt=""
            sx={{ width: 40, height: 40 }}
          />
          Sistema de Gestão de Frotas
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
          Processamento e Análise de Dados de Frotas
        </Typography>
      </Box>
      {telaAtual === "processar-km" ? (
        <ContentContainer>
          <Button
            variant="outlined"
            startIcon={<KeyboardArrowLeftIcon />}
            onClick={voltarParaInicial}
            sx={{ mb: 3 }}
          >
            Voltar para processamento inicial
          </Button>
          <ProcessarKM planilhaOrganizada={planilhaProcessada} />
        </ContentContainer>
      ) : (
        <ContentContainer>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledPaper
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "24px",
                  }}
                >
                  <UploadForm
                    onCustosSelect={(file) => handleSelectFile(file, "custos")}
                    onFrotasSelect={(file) => handleSelectFile(file, "frotas")}
                    custosFileName={previewData.custoNome}
                    frotasFileName={previewData.frotasNome}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 3,
                      "& .MuiButton-root": {
                        py: 1.5,
                        px: 4,
                        borderRadius: "4px",
                      },
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      disabled={carregando || !planilhaCustos || !relacaoFrotas}
                      onClick={carregarPrevia}
                      sx={{
                        backgroundColor: "#f5f5f5",
                        "&:hover": {
                          backgroundColor: "#e0e0e0",
                        },
                      }}
                      fullWidth
                    >
                      Visualizar Prévia
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={carregando}
                      sx={{
                        backgroundColor: "#2196f3",
                        "&:hover": {
                          backgroundColor: "#1976d2",
                        },
                      }}
                      fullWidth
                    >
                      {carregando ? "Processando..." : "Processar Planilhas"}
                    </Button>
                  </Box>

                  {carregando && (
                    <Box sx={{ width: "100%", mt: 2 }}>
                      <LinearProgress variant="determinate" value={progresso} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 1 }}
                      >
                        {progresso}% Concluído
                      </Typography>
                    </Box>
                  )}
                </StyledPaper>
              </Grid>

              {planilhaProcessada && (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={irParaProcessarKM}
                      endIcon={<KeyboardArrowRightIcon />}
                    >
                      Avançar para Processamento de KM Rodados
                    </Button>
                  </Box>
                </Grid>
              )}

              {previewData.mostrarPrevia && (
                <Grid item xs={12}>
                  <StyledPaper>
                    <Typography variant="h6" gutterBottom color="primary">
                      Prévia dos Dados
                    </Typography>
                    {previewData.correspondencia && (
                      <CorrespondenciaInfo data={previewData.correspondencia} />
                    )}
                    {previewData.custos && (
                      <DataTable
                        data={previewData.custos}
                        title="Planilha de Custos"
                      />
                    )}
                    {previewData.frotas && (
                      <DataTable
                        data={previewData.frotas}
                        title="Relação de Frotas"
                      />
                    )}
                  </StyledPaper>
                </Grid>
              )}

              <Grid item xs={12}>
                <StyledPaper>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Como funciona?
                  </Typography>
                  <Box component="ol" sx={{ pl: 3 }}>
                    <Typography component="li" variant="body1" gutterBottom>
                      Faça upload da <strong>planilha de custos</strong>
                    </Typography>
                    <Typography component="li" variant="body1" gutterBottom>
                      Faça upload da <strong>relação de frotas</strong>
                    </Typography>
                    <Typography component="li" variant="body1" gutterBottom>
                      Clique em <strong>Visualizar Prévia</strong> para
                      verificar os dados
                    </Typography>
                    <Typography component="li" variant="body1" gutterBottom>
                      Verifique se as frotas correspondem entre as planilhas
                    </Typography>
                    <Typography component="li" variant="body1" gutterBottom>
                      Se tudo estiver correto, clique em{" "}
                      <strong>Processar Planilhas</strong>
                    </Typography>
                    <Typography component="li" variant="body1" gutterBottom>
                      Aguarde o download do arquivo processado
                    </Typography>
                    <Typography component="li" variant="body1">
                      Após o processamento, você poderá avançar para a{" "}
                      <strong>Segunda Etapa</strong> para processar KM rodados
                    </Typography>
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          </form>
        </ContentContainer>
      )}

      {(erro || mensagem) && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
          }}
        >
          <Alert
            severity={erro ? "error" : "success"}
            onClose={handleCloseMessage}
            sx={{ minWidth: "300px" }}
          >
            {erro || mensagem}
          </Alert>
        </Box>
      )}
    </PageContainer>
  );
}

export default App;
