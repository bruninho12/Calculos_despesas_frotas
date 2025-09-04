import React from "react";
import { Box, Typography, Chip, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

const StatusChip = styled(Chip)(({ theme, statusType }) => ({
  margin: theme.spacing(0.5),
  ...(statusType === "success" && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(statusType === "error" && {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  }),
  ...(statusType === "warning" && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
}));

const CorrespondenciaInfo = ({ data }) => {
  if (!data) return null;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Correspondência de Frotas
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
          <Typography variant="subtitle1">
            Frotas em ambos arquivos: {data.frotas_em_ambos.length}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {data.frotas_em_ambos.map((frota) => (
            <StatusChip
              key={frota}
              label={frota}
              statusType="success"
              icon={<CheckCircleIcon />}
            />
          ))}
        </Box>
      </Box>

      {data.frotas_apenas_custos.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <ErrorIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Frotas apenas na planilha de custos:
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {data.frotas_apenas_custos.map((frota) => (
              <StatusChip
                key={frota}
                label={frota}
                statusType="error"
                icon={<ErrorIcon />}
              />
            ))}
          </Box>
        </Box>
      )}

      {data.frotas_apenas_cadastro.length > 0 && (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Frotas apenas no cadastro:
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {data.frotas_apenas_cadastro.map((frota) => (
              <StatusChip
                key={frota}
                label={frota}
                statusType="warning"
                icon={<WarningIcon />}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default CorrespondenciaInfo;
