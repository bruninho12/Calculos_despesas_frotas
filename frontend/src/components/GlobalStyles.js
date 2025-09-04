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
    })}
  />
);

export default GlobalStyles;
