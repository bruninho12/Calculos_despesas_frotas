import React from "react";
import styled from "styled-components";

const MessageContainer = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: slideIn 0.3s ease-out;

  ${(props) =>
    props.type === "error"
      ? `
    background: #fdecea;
    color: #e74c3c;
    border-left: 4px solid #e74c3c;
  `
      : `
    background: #edfbf3;
    color: #27ae60;
    border-left: 4px solid #27ae60;
  `}

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Icon = styled.span`
  font-size: 1.2rem;
`;

const Text = styled.p`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 500;
`;

const Message = ({ type, children }) => {
  return (
    <MessageContainer type={type}>
      <Icon>{type === "error" ? "⚠️" : "✓"}</Icon>
      <Text>{children}</Text>
    </MessageContainer>
  );
};

export default Message;
