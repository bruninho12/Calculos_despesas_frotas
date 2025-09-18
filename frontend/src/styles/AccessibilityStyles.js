import { createGlobalStyle } from "styled-components";

// Estilos globais para acessibilidade
const AccessibilityStyles = createGlobalStyle`
  /* Melhoria de foco visível para todos os elementos interativos */
  .a11y-focus-visible :focus {
    outline: 3px solid #4285f4 !important;
    outline-offset: 2px !important;
    border-radius: 2px !important;
  }
  
  /* Modo de alto contraste */
  .a11y-high-contrast {
    filter: contrast(1.5) !important;
    
    img, video, iframe {
      filter: contrast(0.8) !important;
    }
    
    a, button, [role="button"] {
      border: 1px solid currentColor !important;
    }
  }
  
  /* Modo de texto grande */
  .a11y-large-text {
    font-size: 120% !important;
    line-height: 1.5 !important;
    
    h1, h2, h3, h4, h5, h6, p, span, button, a, input, textarea, label, li {
      font-size: 120% !important;
    }
    
    .MuiTypography-root {
      font-size: 120% !important;
    }
  }
  
  /* Redução de animações */
  .a11y-reduce-motion * {
    animation-duration: 0.001s !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001s !important;
    scroll-behavior: auto !important;
  }
  
  /* Espaçamento de texto melhorado */
  .a11y-text-spacing {
    letter-spacing: 0.12em !important;
    word-spacing: 0.16em !important;
    line-height: 1.7 !important;
    
    p, li, h1, h2, h3, h4, h5, h6 {
      margin-bottom: 2em !important;
      max-width: 70ch !important;
    }
  }
  
  /* Extras para WCAG 2.1 */
  
  /* Garantir que a orientação da tela não restringe o uso (WCAG 1.3.4) */
  @media screen and (orientation: portrait), screen and (orientation: landscape) {
    html, body {
      width: 100% !important;
      height: 100% !important;
    }
  }
  
  /* Inputs com controles apropriados (WCAG 2.5.3) */
  label {
    display: block;
    margin-bottom: 0.5em;
    font-weight: 500;
  }
  
  /* Melhoria na visibilidade do foco (WCAG 2.4.7) */
  *:focus-visible {
    outline: 3px solid #4285f4 !important;
    outline-offset: 2px !important;
  }
  
  /* Tabindex específico para elementos não-focáveis que receberam tabindex */
  [tabindex]:not(input, select, textarea, button, a):focus {
    outline: 3px dashed #4285f4 !important;
  }
`;

export default AccessibilityStyles;
