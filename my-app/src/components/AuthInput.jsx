import React from "react";

function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  leftIcon,
  rightElement,
}) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        {leftIcon ? <span className="auth-icon left">{leftIcon}</span> : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
        />
        {rightElement ? <span className="auth-icon right">{rightElement}</span> : null}
      </div>
    </div>
  );
}

export default AuthInput;
