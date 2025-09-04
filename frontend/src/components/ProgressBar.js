import React from "react";
import styled from "styled-components";

const ProgressContainer = styled.div`
  margin: 2rem 0;
  text-align: center;
`;

const ProgressBarWrapper = styled.div`
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2980b9);
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  margin-top: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ProgressBar = ({ progress }) => {
  return (
    <ProgressContainer>
      <ProgressBarWrapper>
        <ProgressFill progress={progress} />
      </ProgressBarWrapper>
      <ProgressText>{progress}% Concluído</ProgressText>
    </ProgressContainer>
  );
};

export default ProgressBar;
