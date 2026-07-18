import React from "react";
import PropTypes from "prop-types";
import styles from "./Spinner.module.css";

function Spinner({ size = 20, label }) {
  return (
    <span className={styles.wrapper} role="status" aria-live="polite">
      <span
        className={styles.spinner}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {label && <span className={styles.label}>{label}</span>}
    </span>
  );
}

Spinner.propTypes = {
  size: PropTypes.number,
  label: PropTypes.string,
};

export default Spinner;
