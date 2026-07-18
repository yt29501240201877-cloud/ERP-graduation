import React from "react";
import PropTypes from "prop-types";
import styles from "./FinancialSummaryCard.module.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function FinancialSummaryCard({ subtotal, taxAmount, taxRatePct, total, note }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Financial Summary</h3>

      <div className={styles.row}>
        <span>Subtotal</span>
        <span>{currencyFormatter.format(subtotal)}</span>
      </div>

      <div className={styles.row}>
        <span>Tax Amount {typeof taxRatePct === "number" ? `(${taxRatePct}%)` : ""}</span>
        <span>{currencyFormatter.format(taxAmount)}</span>
      </div>

      <div className={styles.divider} />

      <div className={`${styles.row} ${styles.totalRow}`}>
        <span>Total Amount</span>
        <span>{currencyFormatter.format(total)}</span>
      </div>

      {note && <p className={styles.note}>{note}</p>}
    </div>
  );
}

FinancialSummaryCard.propTypes = {
  subtotal: PropTypes.number.isRequired,
  taxAmount: PropTypes.number.isRequired,
  taxRatePct: PropTypes.number,
  total: PropTypes.number.isRequired,
  note: PropTypes.string,
};

export default FinancialSummaryCard;
