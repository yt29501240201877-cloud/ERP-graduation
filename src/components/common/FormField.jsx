import React from "react";
import PropTypes from "prop-types";
import styles from "./FormField.module.css";

/**
 * Wraps any input (native <input>, <Select>, <textarea>, etc.) with
 * a consistent label. Keeps label typography/spacing in one place
 * instead of repeating it next to every field.
 */
function FormField({ label, htmlFor, children, className = "" }) {
  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={htmlFor} className={styles.label}>
        {label}
      </label>
      {children}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.node.isRequired,
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default FormField;
