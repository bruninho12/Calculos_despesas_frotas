import React, { useState } from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ProcessarKM from "./components/ProcessarKM";
import Header from "./components/Header";
import UploadForm from "./components/UploadForm";
import ProgressBar from "./components/ProgressBar";
import SkipNavigation from "./components/SkipNavigation";
import { useNotification } from "./contexts/NotificationContext";

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
  const [carregando, setCarregando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [telaAtual, setTelaAtual] = useState("inicial");
  const [planilhaProcessada, setPlanilhaProcessada] = useState(null);
  const { showError, showSuccess, showInfo } = useNotification();
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
      showError("Selecione ambas as planilhas para visualizar a prévia.");
      return;
    }

    setCarregando(true);
    showInfo("Carregando prévia dos dados...");

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
        showSuccess("Prévia carregada com sucesso!");
      } else {
        showError(data.message || "Erro ao carregar prévia dos dados.");
      }
    } catch (err) {
      showError(`Erro ao conectar com o servidor: ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!planilhaCustos) {
      showError("Selecione a Planilha de Custos.");
      return;
    }

    if (!relacaoFrotas) {
      showError("Selecione a Relação de Frotas.");
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
      setProgresso(50);
      const url = window.URL.createObjectURL(blob);

      try {
        const planilhaFile = new File([blob], "planilha_organizada.xlsx", {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          lastModified: new Date().getTime(),
        });

        if (planilhaFile instanceof File) {
          setPlanilhaProcessada(planilhaFile);
        } else {
          showError("Falha ao preparar arquivo para a próxima etapa.");
        }
      } catch (fileError) {
        showError(
          "Erro ao preparar arquivo para a próxima etapa: " + fileError.message
        );
      }

      const a = document.createElement("a");
      a.href = url;
      a.download = "planilha_organizada.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      showSuccess("Processamento concluído! O download foi iniciado.");
      setTimeout(() => setTelaAtual("processar-km"), 2000);
    } catch (err) {
      showError(err?.message || "Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  const voltarParaInicial = () => setTelaAtual("inicial");

  const irParaProcessarKM = () => {
    if (planilhaProcessada) {
      setTelaAtual("processar-km");
    } else {
      showError("Você precisa processar as planilhas iniciais primeiro!");
    }
  };

  return (
    <PageContainer>
      <SkipNavigation />
      <Header />
      {telaAtual === "processar-km" ? (
        <ContentContainer id="main-content" tabIndex="-1">
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
        <ContentContainer id="main-content" tabIndex="-1">
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
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      mt: 3,
                      width: "100%",
                      "& .MuiButton-root": {
                        py: { xs: 1.25, sm: 1.5 },
                        px: { xs: 2, sm: 4 },
                        borderRadius: "4px",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
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
                        flex: { sm: 1 },
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
                        flex: { sm: 1 },
                      }}
                      fullWidth
                    >
                      {carregando ? "Processando..." : "Processar Planilhas"}
                    </Button>
                  </Box>

                  {carregando && (
                    <ProgressBar
                      progress={progresso}
                      isIndeterminate={progresso === 0}
                      animate={true}
                    />
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
                <StyledPaper
                  sx={{
                    bgcolor: "#e3f2fd",
                    borderLeft: "4px solid #1976d2",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}
                  >
                    <Box
                      component="img"
                      src="/truck-icon.png"
                      alt=""
                      sx={{ width: 32, height: 32, mt: 0.5 }}
                    />
                    <Box>
                      <Typography variant="h6" color="primary" gutterBottom>
                        NOVIDADE: Integração com Power BI
                      </Typography>
                      <Typography variant="body1" paragraph>
                        Agora você pode visualizar seus dados diretamente no
                        Power BI! Após processar suas planilhas na segunda
                        etapa, você poderá baixar um template do Power BI para
                        análises avançadas e visuais interativos.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Basta processar suas planilhas normalmente e na tela
                        final você terá a opção de baixar o template do Power BI
                        junto com seus dados.
                      </Typography>
                    </Box>
                  </Box>
                </StyledPaper>

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
                      <strong>Segunda Etapa</strong> para processar KM rodados e
                      usar o <strong>Power BI</strong>
                    </Typography>
                  </Box>
                </StyledPaper>
              </Grid>
            </Grid>
          </form>
        </ContentContainer>
      )}
    </PageContainer>
  );
}

export default App;
