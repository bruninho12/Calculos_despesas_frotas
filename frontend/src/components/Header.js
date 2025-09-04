import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  color: white;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  
  img {
    height: 80px;
    width: auto;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>
        {/* Aqui você pode adicionar o logo da empresa */}
        {/* <img src="/logo.png" alt="Logo da Empresa" /> */}
      </Logo>
      <Title>Sistema de Gestão de Frotas</Title>
      <Subtitle>
        Sistema profissional para processamento e análise de dados de frotas
      </Subtitle>
    </HeaderContainer>
  );
};

export default Header;om "react";

function Header() {
  return (
    <header className="header fade-in">
      <div className="logo-container">
        {/* Aqui você pode adicionar o logo da empresa */}
      </div>
      <h1>Sistema de Gestão de Frotas</h1>
      <p>Processamento e Análise de Dados de Frotas</p>
    </header>
  );
}

export default Header;
