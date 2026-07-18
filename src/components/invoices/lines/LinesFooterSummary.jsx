import React from "react";
import PropTypes from "prop-types";
import Button from "../../common/Button";
import styles from "./LinesFooterSummary.module.css";

const SendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function LinesFooterSummary({ subtotal, taxAmount, total, onCancelDraft, onFinalize, isSubmitting = false }) {
  return (
    <div className={styles.footer}>
      <div className={styles.totals}>
        <div className={styles.totalItem}>
          <span className={styles.label}>Subtotal</span>
          <span className={styles.value}>{currencyFormatter.format(subtotal)}</span>
        </div>
        <div className={styles.totalItem}>
          <span className={styles.label}>Tax Amount</span>
          <span className={styles.value}>{currencyFormatter.format(taxAmount)}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.totalItem}>
          <span className={styles.label}>Total Invoice Amount</span>
          <span className={styles.grandTotal}>{currencyFormatter.format(total)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancelDraft}>
          Cancel Draft
        </Button>
        <Button variant="primary" icon={<SendIcon />} onClick={onFinalize} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Finalize & Submit Invoice"}
        </Button>
      </div>
    </div>
  );
}

LinesFooterSummary.propTypes = {
  subtotal: PropTypes.number.isRequired,
  taxAmount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onCancelDraft: PropTypes.func,
  onFinalize: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

export default LinesFooterSummary;
