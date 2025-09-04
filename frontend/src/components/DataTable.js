import React from "react";

function DataTable({ data, title }) {
  if (!data?.primeiras_linhas?.length) return null;

  return (
    <div className="table-container fade-in">
      <h3>{title}</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {data.colunas.map((coluna, index) => (
                <th key={index}>{coluna}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.primeiras_linhas.map((linha, rowIndex) => (
              <tr key={rowIndex}>
                {data.colunas.map((coluna, colIndex) => (
                  <td key={colIndex}>
                    {linha[coluna] !== null && linha[coluna] !== undefined
                      ? String(linha[coluna])
                      : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-info">
        <p>Total de registros: {data.num_linhas}</p>
        {data.estatisticas && (
          <div className="statistics">
            {Object.entries(data.estatisticas).map(([key, value], i) => (
              <span key={i} className="statistic-item">
                {key.replace(/_/g, " ")}: {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataTable;
