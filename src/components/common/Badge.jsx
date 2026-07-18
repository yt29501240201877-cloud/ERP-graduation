import React from "react";
import PropTypes from "prop-types";
import styles from "./Badge.module.css";

const VARIANT_CLASS = {
  info: styles.info,
  success: styles.success,
  neutral: styles.neutral,
  danger: styles.danger,
};

/**
 * Small status pill. Callers decide the color via `variant` and
 * supply the visible text via `label` - the component itself has no
 * opinion on what "PENDING" or "Draft" mean, so it works equally for
 * invoice statuses, payment statuses, or anything added later.
 */
function Badge({ label, variant = "neutral" }) {
  const variantClass = VARIANT_CLASS[variant] || styles.neutral;
  return <span className={`${styles.badge} ${variantClass}`}>{label}</span>;
}

Badge.propTypes = {
  label: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["info", "success", "neutral", "danger"]),
};

export default Badge;
