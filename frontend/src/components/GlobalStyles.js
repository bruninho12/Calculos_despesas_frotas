import { GlobalStyles as MuiGlobalStyles } from "@mui/material";

const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={(theme) => ({
      "*": {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      },
      html: {
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        height: "100%",
        width: "100%",
      },
      body: {
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.background.default,
        overflowX: "hidden",
      },
      "#root": {
        height: "100%",
        width: "100%",
      },
      "input[type=number]": {
        MozAppearance: "textfield",
        "&::-webkit-outer-spin-button": {
          margin: 0,
          WebkitAppearance: "none",
        },
        "&::-webkit-inner-spin-button": {
          margin: 0,
          WebkitAppearance: "none",
        },
      },
      img: {
        display: "block",
        maxWidth: "100%",
      },
      ul: {
        margin: 0,
        padding: 0,
        listStyle: "none",
      },
      a: {
        textDecoration: "none",
        color: "inherit",
      },
      // Animações
      ".fade-in": {
        animation: "fadeIn 0.3s ease-in",
      },
      "@keyframes fadeIn": {
        from: {
          opacity: 0,
          transform: "translateY(10px)",
        },
        to: {
          opacity: 1,
          transform: "translateY(0)",
        },
      },
      // Classes de utilidade para responsividade
      ".hide-on-mobile": {
        [theme.breakpoints.down("sm")]: {
          display: "none !important",
        },
      },
      ".show-on-mobile": {
        [theme.breakpoints.up("md")]: {
          display: "none !important",
        },
      },
      // Melhorar responsividade de tabelas
      ".responsive-table": {
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        msOverflowStyle: "-ms-autohiding-scrollbar",
      },
      // Melhorar legibilidade em dispositivos móveis
      "h1, h2, h3, h4, h5, h6": {
        wordBreak: "break-word",
        overflowWrap: "break-word",
      },
      // Melhorar a aparência de elementos de formulário em dispositivos móveis
      "input, select, textarea, button": {
        fontSize: "16px", // Evita zoom automático em iOS
      },
      // Ajuste para tables responsivas
      ".MuiTableContainer-root": {
        maxWidth: "100%",
      },
      // Classes para acessibilidade
      ".sr-only": {
        position: "absolute",
        width: "1px",
        height: "1px",
        padding: 0,
        margin: "-1px",
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      },
      ".focus-visible:focus": {
        outline: "3px solid #4285f4 !important",
        outlineOffset: "2px",
      },
      // Melhorias para acessibilidade
      "a:focus, button:focus, input:focus, select:focus, textarea:focus": {
        outline: "2px solid #4285f4",
        outlineOffset: "2px",
      },
      // Melhorar experiência de teclado
      "[role='button'], [role='tab']": {
        cursor: "pointer",
      },
      // Suporte a atributos ARIA
      "[aria-disabled='true']": {
        cursor: "not-allowed",
        opacity: 0.6,
      },
    })}
  />
);

export default GlobalStyles;
