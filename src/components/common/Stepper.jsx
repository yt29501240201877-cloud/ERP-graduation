import React from "react";
import PropTypes from "prop-types";
import styles from "./Stepper.module.css";

/**
 * Generic horizontal step indicator. `steps` is any ordered list of
 * labels; `activeIndex` (0-based) marks the current step. Reusable
 * for any multi-stage workflow, not just invoice creation.
 */
function Stepper({ steps, activeIndex }) {
  return (
    <div className={styles.stepper} role="list">
      {steps.map((label, index) => (
        <React.Fragment key={label}>
          <div className={styles.step} role="listitem">
            <span
              className={`${styles.badge} ${
                index === activeIndex ? styles.active : index < activeIndex ? styles.done : ""
              }`}
            >
              {index + 1}
            </span>
            <span className={`${styles.label} ${index === activeIndex ? styles.activeLabel : ""}`}>
              {label}
            </span>
          </div>
          {index < steps.length - 1 && <span className={styles.connector} />}
        </React.Fragment>
      ))}
    </div>
  );
}

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeIndex: PropTypes.number.isRequired,
};

export default Stepper;
