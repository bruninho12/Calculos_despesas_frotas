import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility deve ser usado dentro de um AccessibilityProvider"
    );
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    focusVisible: true,
    textSpacing: false,
  });

  // Carregar configurações do localStorage, se disponíveis
  useEffect(() => {
    const savedSettings = localStorage.getItem("accessibilitySettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error(
          "Erro ao carregar configurações de acessibilidade:",
          error
        );
      }
    }

    // Verificar preferência de movimento reduzido do sistema
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setSettings((prev) => ({
        ...prev,
        reduceMotion: true,
      }));
    }
  }, []);

  // Salvar configurações no localStorage quando alteradas
  useEffect(() => {
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));

    // Aplicar as configurações ao documento
    applyAccessibilitySettings(settings);
  }, [settings]);

  // Aplicar configurações de acessibilidade ao DOM
  const applyAccessibilitySettings = (settings) => {
    const { highContrast, largeText, reduceMotion, focusVisible, textSpacing } =
      settings;

    // Aplicar classes ao body para CSS
    document.body.classList.toggle("a11y-high-contrast", highContrast);
    document.body.classList.toggle("a11y-large-text", largeText);
    document.body.classList.toggle("a11y-reduce-motion", reduceMotion);
    document.body.classList.toggle("a11y-focus-visible", focusVisible);
    document.body.classList.toggle("a11y-text-spacing", textSpacing);

    // Atualizar meta tags para acessibilidade
    let meta = document.querySelector('meta[name="color-scheme"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "color-scheme");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", highContrast ? "light dark" : "normal");
  };

  // Alterna as configurações de acessibilidade
  const toggleSetting = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  // Define uma configuração específica
  const setSetting = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  // Restaura as configurações padrão
  const resetSettings = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      reduceMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
      focusVisible: true,
      textSpacing: false,
    };

    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        ...settings,
        toggleSetting,
        setSetting,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityContext;
