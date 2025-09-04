import styled from "styled-components";

export const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h1 {
    color: #2c3e50;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    color: #7f8c8d;
    font-size: 1.1rem;
  }
`;

export const Form = styled.form`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const FileInputContainer = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    color: #2c3e50;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  input[type="file"] {
    width: 100%;
    padding: 1rem;
    border: 2px dashed #3498db;
    border-radius: 8px;
    background: #f8fafc;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #2c3e50;
      background: #fff;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: ${(props) => (props.primary ? "#3498db" : "#27ae60")};
  color: white;

  &:hover {
    background: ${(props) => (props.primary ? "#2980b9" : "#219a52")};
  }

  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }
`;

export const ProgressContainer = styled.div`
  margin: 1.5rem 0;
`;

export const ProgressBar = styled.div`
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #3498db;
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

export const ProgressText = styled.div`
  text-align: center;
  color: #7f8c8d;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

export const Message = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${(props) => (props.type === "error" ? "#fdecea" : "#e8f5e9")};
  color: ${(props) => (props.type === "error" ? "#e74c3c" : "#27ae60")};
  border-left: 4px solid
    ${(props) => (props.type === "error" ? "#e74c3c" : "#27ae60")};
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  margin: 1.5rem 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      background: #2c3e50;
      color: white;
      padding: 1rem;
      text-align: left;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #eee;
    }

    tr:hover {
      background: #f8fafc;
    }
  }
`;

export const InfoBox = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-top: 2rem;

  h2 {
    color: #2c3e50;
    margin-bottom: 1rem;
  }

  ol {
    padding-left: 1.5rem;
    color: #7f8c8d;

    li {
      margin-bottom: 0.5rem;
    }
  }
`;

export const FadeIn = styled.div`
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
