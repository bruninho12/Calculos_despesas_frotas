import React from "react";
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const TableContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  animation: "fadeIn 0.3s ease-in",
}));

const TableWrapper = styled(Box)(({ theme }) => ({
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  width: "100%",
  "&::-webkit-scrollbar": {
    height: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.mode === "light" ? "#bbb" : "#444",
    borderRadius: "4px",
  },
}));

const StyledTable = styled("table")(({ theme }) => ({
  width: "100%",
  borderCollapse: "collapse",
  "& th, & td": {
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.divider}`,
    textAlign: "left",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0.75),
      fontSize: "0.85rem",
    },
  },
  "& th": {
    backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#333",
    fontWeight: 600,
  },
  "& tr:nth-of-type(even)": {
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.02)"
        : "rgba(255, 255, 255, 0.02)",
  },
}));

const TableInfo = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

const Statistics = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
}));

const StatisticItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  backgroundColor: theme.palette.mode === "light" ? "#f5f5f5" : "#333",
  borderRadius: "4px",
  fontSize: "0.8rem",
}));

function DataTable({ data, title }) {
  if (!data?.primeiras_linhas?.length) return null;

  // ID único para garantir que a tabela e seu título estejam conectados via aria-labelledby
  const tableId = `table-${
    title?.replace(/\s+/g, "-").toLowerCase() ||
    Math.random().toString(36).substring(2, 9)
  }`;

  return (
    <TableContainer className="fade-in">
      <Typography variant="h6" gutterBottom id={`${tableId}-title`}>
        {title}
      </Typography>
      <TableWrapper
        className="responsive-table"
        role="region"
        aria-labelledby={`${tableId}-title`}
        tabIndex={0}
      >
        <StyledTable aria-labelledby={`${tableId}-title`} role="table">
          <caption className="sr-only">
            Tabela de dados {title ? `de ${title}` : ""} - Mostrando os
            primeiros {data.primeiras_linhas.length} de {data.num_linhas}{" "}
            registros
          </caption>
          <thead>
            <tr>
              {data.colunas.map((coluna, index) => (
                <th key={index} scope="col">
                  {coluna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.primeiras_linhas.map((linha, rowIndex) => (
              <tr key={rowIndex}>
                {data.colunas.map((coluna, colIndex) => {
                  // Primeiro campo pode ser considerado um cabeçalho de linha em alguns casos
                  const cellProps = colIndex === 0 ? { scope: "row" } : {};
                  return (
                    <td key={colIndex} {...cellProps}>
                      {linha[coluna] !== null && linha[coluna] !== undefined
                        ? String(linha[coluna])
                        : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>
      <TableInfo aria-live="polite">
        <Typography variant="caption">
          Total de registros: {data.num_linhas}
        </Typography>
        {data.estatisticas && (
          <Statistics>
            {Object.entries(data.estatisticas).map(([key, value], i) => (
              <StatisticItem key={i}>
                <abbr title={key.replace(/_/g, " ")}>
                  {key.replace(/_/g, " ")}
                </abbr>
                : {value}
              </StatisticItem>
            ))}
          </Statistics>
        )}
      </TableInfo>
    </TableContainer>
  );
}

export default DataTable;
