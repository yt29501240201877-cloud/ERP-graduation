import React from "react";
import PropTypes from "prop-types";
import Card from "../../common/Card";
import Button from "../../common/Button";
import styles from "./InvoiceHeaderBar.module.css";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function InvoiceHeaderBar({ invoice, onEditHeader, onSaveProgress, isSaving = false }) {
  return (
    <Card noPadding className={styles.card}>
      <div className={styles.grid}>
        <div className={styles.field}>
          <span className={styles.label}>Invoice Number</span>
          <span className={styles.value}>{invoice.id}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Vendor</span>
          <span className={styles.value}>{invoice.vendorName}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Invoice Date</span>
          <span className={styles.value}>{dateFormatter.format(new Date(invoice.invoiceDate))}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.label}>Due Date</span>
          <span className={`${styles.value} ${styles.dueDate}`}>
            {dateFormatter.format(new Date(invoice.dueDate))}
          </span>
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={onEditHeader}>
            Edit Header
          </Button>
          <Button variant="primary" onClick={onSaveProgress} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Progress"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

InvoiceHeaderBar.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.string.isRequired,
    vendorName: PropTypes.string.isRequired,
    invoiceDate: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
  }).isRequired,
  onEditHeader: PropTypes.func,
  onSaveProgress: PropTypes.func,
  isSaving: PropTypes.bool,
};

export default InvoiceHeaderBar;
