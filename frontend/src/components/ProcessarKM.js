import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";

// URL base para a API
const API_BASE_URL = "https://frota-api-qro2.onrender.com";

// Styled Components
const UploadBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  padding: theme.spacing(3),
}));

const FileInput = styled("input")({
  display: "none",
});

const UploadButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(2),
  borderStyle: "dashed",
  borderWidth: 2,
  textTransform: "none",
}));

const FileInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
}));

function ProcessarKM({ planilhaOrganizada }) {
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

    if (!(planilhaOrganizada instanceof File)) {
      setErro(
        "Planilha organizada não é válida. Por favor, reinicie o processo."
      );
      return;
    }

    setCarregando(true);
    setErro("");
    setMensagem("Carregando prévia dos dados de KM rodados...");

    const formData = new FormData();
    formData.append("planilha_km", planilhaKM);
    formData.append("planilha_organizada", planilhaOrganizada);

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
        const errorText = await response.text();
        setErro(
          `Erro ${response.status}: ${response.statusText} - ${errorText}`
        );
      }
    } catch (err) {
      setErro(`Erro ao conectar com o servidor: ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  const processarDados = async () => {
    if (!planilhaKM || !planilhaOrganizada) {
      setErro("Selecione a planilha de KM rodados para continuar.");
      return;
    }

    if (!(planilhaOrganizada instanceof File)) {
      setErro(
        "Planilha organizada não é válida. Por favor, reinicie o processo."
      );
      return;
    }

    setCarregando(true);
    setErro("");
    setMensagem("Processando dados...");

    const formData = new FormData();
    formData.append("planilha_km", planilhaKM);
    formData.append("planilha_organizada", planilhaOrganizada);

    try {
      const url = `${API_BASE_URL}/processar-km/?skip_validation=true`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const filename =
          response.headers
            .get("Content-Disposition")
            ?.split("filename=")[1]
            ?.replace(/"/g, "") || "planilha_completa.xlsx";

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
        const errorText = await response.text();
        setErro(
          `Erro ${response.status}: ${response.statusText} - ${errorText}`
        );
      }
    } catch (err) {
      setErro(`Erro ao conectar com o servidor: ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }}>
      <Paper
        elevation={3}
        sx={{
          bgcolor: "#2a79b9",
          color: "white",
          p: 3,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            component="img"
            src="/truck-icon.png"
            alt=""
            sx={{ width: 40, height: 40 }}
          />
          Processar Planilha KM Rodados
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
          Processamento e Análise de Dados de Frotas
        </Typography>
      </Paper>

      {(erro || mensagem) && (
        <Alert
          severity={erro ? "error" : "success"}
          sx={{ mb: 3 }}
          onClose={() => (erro ? setErro("") : setMensagem(""))}
        >
          {erro || mensagem}
          {erro?.includes("Colunas") && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Informação:</strong> O sistema agora foi atualizado para
                calcular automaticamente as métricas necessárias a partir dos
                dados brutos.
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Colunas necessárias na planilha:</strong>
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="NUM_FROTA"
                    secondary="Identificador da frota"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="KM_ATUAL"
                    secondary="Quilometragem atual no momento do registro"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="DTA_MOVIMENTO"
                    secondary="Data do registro"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="info" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="QTDE_ITEM (opcional)"
                    secondary="Para calcular litros consumidos"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <InfoIcon color="info" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary="DSC_TIPO_DESPESAS (opcional)"
                    secondary="Para identificar abastecimentos"
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </Alert>
      )}

      <Paper elevation={2}>
        <UploadBox>
          <Box>
            <Typography variant="h6" color="primary" gutterBottom>
              Planilha de KM Rodados
            </Typography>
            <label htmlFor="km-upload">
              <FileInput
                id="km-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleSelectFile}
              />
              <UploadButton
                variant="outlined"
                component="span"
                startIcon={<UploadFileIcon />}
              >
                {planilhaKMNome || "Selecionar arquivo da planilha de KM"}
              </UploadButton>
            </label>
            {planilhaKMNome && (
              <FileInfo>
                <CheckCircleOutlineIcon color="success" fontSize="small" />
                <Typography variant="body2">{planilhaKMNome}</Typography>
              </FileInfo>
            )}
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              O sistema calculará automaticamente:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Km Rodados Mês"
                  secondary="Diferença entre KM máximo e mínimo por frota/mês"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Qtd Litros Consumidos"
                  secondary="Soma dos abastecimentos por frota/mês"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Custo / Km Rodado"
                  secondary="Total Despesas dividido pelos KM rodados"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowForwardIcon color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary="Média Consumo"
                  secondary="KM rodados dividido pela quantidade de litros"
                />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ mt: 3, bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <InfoIcon fontSize="small" color="info" />
              Planilha organizada já selecionada:{" "}
              {planilhaOrganizada && planilhaOrganizada instanceof File
                ? planilhaOrganizada.name
                : planilhaOrganizada
                ? "Arquivo inválido (recarregue a página)"
                : "Nenhuma"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={carregarPrevia}
              disabled={carregando || !planilhaKM || !planilhaOrganizada}
              startIcon={<VisibilityIcon />}
              sx={{ flex: 1 }}
            >
              Visualizar Prévia
            </Button>
            <Button
              variant="contained"
              onClick={processarDados}
              disabled={carregando || !planilhaKM || !planilhaOrganizada}
              startIcon={
                carregando ? (
                  <CircularProgress size={20} />
                ) : (
                  <CloudUploadIcon />
                )
              }
              sx={{ flex: 1 }}
            >
              {carregando ? "Processando..." : "Processar Planilhas"}
            </Button>
          </Box>
        </UploadBox>
      </Paper>

      {previewData.mostrarPrevia && (
        <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Prévia dos Dados
          </Typography>

          {previewData.km &&
            typeof previewData.km === "object" &&
            previewData.km.primeiras_linhas && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Planilha de KM Rodados
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {previewData.km.colunas.map((coluna, index) => (
                          <TableCell key={index} sx={{ fontWeight: "bold" }}>
                            {coluna}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewData.km.primeiras_linhas.map(
                        (linha, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {previewData.km.colunas.map((coluna, colIndex) => (
                              <TableCell
                                key={colIndex}
                                align={
                                  typeof linha[coluna] === "number"
                                    ? "right"
                                    : "left"
                                }
                              >
                                {linha[coluna] !== null &&
                                linha[coluna] !== undefined
                                  ? String(linha[coluna])
                                  : ""}
                              </TableCell>
                            ))}
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Total de linhas: {previewData.km.num_linhas} | Mostrando as
                  primeiras {previewData.km.primeiras_linhas.length} linhas
                </Typography>
              </Box>
            )}

          {previewData.organizada &&
            typeof previewData.organizada === "object" &&
            previewData.organizada.primeiras_linhas && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Planilha Organizada
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {previewData.organizada.colunas.map((coluna, index) => (
                          <TableCell key={index} sx={{ fontWeight: "bold" }}>
                            {coluna}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {previewData.organizada.primeiras_linhas.map(
                        (linha, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {previewData.organizada.colunas.map(
                              (coluna, colIndex) => (
                                <TableCell
                                  key={colIndex}
                                  align={
                                    typeof linha[coluna] === "number"
                                      ? "right"
                                      : "left"
                                  }
                                >
                                  {linha[coluna] !== null &&
                                  linha[coluna] !== undefined
                                    ? String(linha[coluna])
                                    : ""}
                                </TableCell>
                              )
                            )}
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Total de linhas: {previewData.organizada.num_linhas} |
                  Mostrando as primeiras{" "}
                  {previewData.organizada.primeiras_linhas.length} linhas
                </Typography>
              </Box>
            )}
        </Paper>
      )}

      {resultado && (
        <Paper elevation={2} sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Processamento Concluído
          </Typography>
          <Typography variant="body1" paragraph>
            O arquivo com os dados processados está pronto para download.
          </Typography>
          <Button
            href={resultado.download_url}
            download
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            sx={{ mb: 2 }}
          >
            Baixar Planilha Final
          </Button>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Nome do arquivo:</strong> {resultado.filename}
            </Typography>
            <Typography variant="body2">
              <strong>Registros processados:</strong>{" "}
              {resultado.registros_processados}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}

export default ProcessarKM;
