import React from "react";
import PropTypes from "prop-types";
import Card from "../../common/Card";
import FormField from "../../common/FormField";
import Select from "../../common/Select";
import Input from "../../common/Input";
import { VENDOR_OPTIONS, PAYMENT_TERMS_OPTIONS, ACCOUNTING_PERIOD_OPTIONS } from "../../../constants/formOptions";
import styles from "./InvoiceMetaForm.module.css";

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 4v5h5M20 20v-5h-5M4.6 9a8 8 0 0113.9-3.5L20 9M19.4 15a8 8 0 01-13.9 3.5L4 15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Controlled form - all values/handlers come from the parent
 * (CreateInvoicePage) so this stays a pure presentation component.
 */
function InvoiceMetaForm({ values, onChange, onRegenerateInvoiceNumber }) {
  const set = (field) => (e) => onChange(field, e.target.value);

  return (
    <Card className={styles.card}>
      <div className={styles.grid}>
        <FormField label="Vendor Selection" htmlFor="vendor">
          <Select
            id="vendor"
            value={values.vendorId}
            onChange={set("vendorId")}
            options={VENDOR_OPTIONS}
            placeholder="Select Vendor..."
          />
        </FormField>

        <FormField label="Invoice Number" htmlFor="invoiceNumber">
          <div className={styles.withButton}>
            <Input id="invoiceNumber" value={values.invoiceNumber} onChange={set("invoiceNumber")} />
            <button
              type="button"
              className={styles.regenerateButton}
              onClick={onRegenerateInvoiceNumber}
              aria-label="Regenerate invoice number"
            >
              <RefreshIcon />
            </button>
          </div>
        </FormField>

        <FormField label="Accounting Period" htmlFor="accountingPeriod">
          <Select
            id="accountingPeriod"
            value={values.accountingPeriod}
            onChange={set("accountingPeriod")}
            options={ACCOUNTING_PERIOD_OPTIONS}
          />
        </FormField>

        <FormField label="Invoice Date" htmlFor="invoiceDate">
          <Input id="invoiceDate" type="date" value={values.invoiceDate} onChange={set("invoiceDate")} />
        </FormField>

        <FormField label="Due Date" htmlFor="dueDate">
          <Input id="dueDate" type="date" value={values.dueDate} onChange={set("dueDate")} />
        </FormField>

        <FormField label="Payment Terms" htmlFor="paymentTerms">
          <Select
            id="paymentTerms"
            value={values.paymentTerms}
            onChange={set("paymentTerms")}
            options={PAYMENT_TERMS_OPTIONS}
          />
        </FormField>
      </div>
    </Card>
  );
}

InvoiceMetaForm.propTypes = {
  values: PropTypes.shape({
    vendorId: PropTypes.string,
    invoiceNumber: PropTypes.string,
    accountingPeriod: PropTypes.string,
    invoiceDate: PropTypes.string,
    dueDate: PropTypes.string,
    paymentTerms: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onRegenerateInvoiceNumber: PropTypes.func,
};

export default InvoiceMetaForm;
