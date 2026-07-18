import React from "react";
import PropTypes from "prop-types";
import styles from "./DashboardHeader.module.css";

/**
 * Shared page-header layout: title + subtitle on the left, an
 * `actions` slot on the right. The caller decides what goes in
 * `actions` (Export+New Invoice on the Invoices page, just New
 * Payment on the Payments page) so this component never needs to
 * know about specific buttons.
 */
function DashboardHeader({ title, subtitle, actions }) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
};

export default DashboardHeader;
