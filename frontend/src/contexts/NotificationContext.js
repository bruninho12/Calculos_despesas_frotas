import React, { createContext, useContext, useState, useCallback } from "react";
import Notification from "../components/Notification";

// Criando o contexto
const NotificationContext = createContext();

// Hook personalizado para usar o contexto
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification deve ser usado dentro de um NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "info", // info, success, warning, error
    position: { vertical: "top", horizontal: "center" },
    autoHideDuration: 5000,
    variant: "custom", // custom, standard
  });

  // Função para mostrar uma notificação
  const showNotification = useCallback(
    ({
      message,
      type = "info",
      position = { vertical: "top", horizontal: "center" },
      autoHideDuration = 5000,
      variant = "custom",
    }) => {
      setNotification({
        open: true,
        message,
        type,
        position,
        autoHideDuration,
        variant,
      });
    },
    []
  );

  // Função para mostrar notificação de sucesso
  const showSuccess = useCallback(
    (message, options = {}) => {
      showNotification({ message, type: "success", ...options });
    },
    [showNotification]
  );

  // Função para mostrar notificação de erro
  const showError = useCallback(
    (message, options = {}) => {
      showNotification({ message, type: "error", ...options });
    },
    [showNotification]
  );

  // Função para mostrar notificação de alerta
  const showWarning = useCallback(
    (message, options = {}) => {
      showNotification({ message, type: "warning", ...options });
    },
    [showNotification]
  );

  // Função para mostrar notificação de informação
  const showInfo = useCallback(
    (message, options = {}) => {
      showNotification({ message, type: "info", ...options });
    },
    [showNotification]
  );

  // Função para fechar a notificação
  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeNotification,
      }}
    >
      {children}
      <Notification
        open={notification.open}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
        position={notification.position}
        autoHideDuration={notification.autoHideDuration}
        variant={notification.variant}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
