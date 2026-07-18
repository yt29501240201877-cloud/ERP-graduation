import React from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import styles from "./StatCard.module.css";

/**
 * One tile in a stats row. `footer` is any node (a trend line, a
 * helper caption, a progress bar) and `icon` is an optional glyph
 * shown top-right of the label - together these cover every stat
 * card variant across Invoices and Payments without branching logic
 * inside this component.
 */
function StatCard({ label, value, footer, icon }) {
  return (
    <Card className={styles.card}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <span className={styles.value}>{value}</span>
      {footer && <div className={styles.footer}>{footer}</div>}
    </Card>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.node,
  icon: PropTypes.node,
};

export default StatCard;
