import React from "react";
import styled from "styled-components";

const FormContainer = styled.form`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px dashed #3498db;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #2c3e50;
    background: white;
  }

  &:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${(props) =>
    props.primary
      ? `
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #2980b9 0%, #2472a4 100%);
    }
  `
      : `
    background: linear-gradient(135deg, #27ae60 0%, #219a52 100%);
    color: white;

    &:hover {
      background: linear-gradient(135deg, #219a52 0%, #1e8449 100%);
    }
  `}

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

const UploadForm = ({
  onSubmit,
  onPreview,
  loading,
  planilhaCustos,
  relacaoFrotas,
  onFileSelect,
}) => {
  return (
    <FormContainer onSubmit={onSubmit}>
      <InputGroup>
        <Label>Planilha de Custos</Label>
        <FileInput
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => onFileSelect(e, "custos")}
          required
        />
      </InputGroup>

      <InputGroup>
        <Label>Relação de Frotas</Label>
        <FileInput
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => onFileSelect(e, "frotas")}
          required
        />
      </InputGroup>

      <ButtonGroup>
        <Button
          type="button"
          onClick={onPreview}
          disabled={loading || !planilhaCustos || !relacaoFrotas}
        >
          Visualizar Prévia
        </Button>
        <Button type="submit" primary disabled={loading}>
          {loading ? "Processando..." : "Processar Planilhas"}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default UploadForm;
