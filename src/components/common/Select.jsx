import React from "react";
import PropTypes from "prop-types";
import controlStyles from "./inputs.module.css";

function Select({ id, value, onChange, options, placeholder, disabled = false }) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={controlStyles.control}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

Select.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Select;
