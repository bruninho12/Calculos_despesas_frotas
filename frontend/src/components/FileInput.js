import React from "react";

function FileInput({ label, onChange, accept, required }) {
  return (
    <div className="input-group fade-in">
      <h3>{label}</h3>
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        required={required}
        className="file-input"
      />
    </div>
  );
}

export default FileInput;
