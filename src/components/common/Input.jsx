import React from "react";
import PropTypes from "prop-types";
import controlStyles from "./inputs.module.css";

/**
 * Thin wrapper over the native <input>, just so every text/number/
 * date field in the app shares one visual style (see inputs.module.css)
 * without each form re-declaring className logic.
 */
function Input({ id, type = "text", value, onChange, placeholder, prefix, disabled = false, min, step }) {
  if (prefix) {
    return (
      <div className={controlStyles.control} style={{ display: "flex", alignItems: "center", padding: "0 14px", gap: 6 }}>
        <span style={{ color: "var(--color-text-muted)" }}>{prefix}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          step={step}
          style={{ border: "none", outline: "none", flex: 1, padding: "11px 0", fontSize: 14, background: "transparent" }}
        />
      </div>
    );
  }

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      step={step}
      className={controlStyles.control}
    />
  );
}

Input.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  prefix: PropTypes.node,
  disabled: PropTypes.bool,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Input;
