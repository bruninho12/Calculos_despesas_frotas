import React from "react";

function Button({
  type = "button",
  variant = "primary",
  onClick,
  disabled,
  children,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${disabled ? "disabled" : ""}`}
    >
      {children}
    </button>
  );
}

export default Button;
