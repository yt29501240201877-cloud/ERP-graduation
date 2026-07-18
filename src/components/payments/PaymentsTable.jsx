import React from "react";
import PropTypes from "prop-types";
import Card from "../common/Card";
import Table from "../common/Table";
import Badge from "../common/Badge";
import Pagination from "../common/Pagination";
import Button from "../common/Button";
import ExportButton from "../common/ExportButton";
import PaymentMethod from "./PaymentMethod";
import { FilterIcon } from "../common/icons";
import { exportPaymentsCsv } from "../../services/paymentService";
import styles from "./PaymentsTable.module.css";

const COLUMNS = [
  { key: "date", header: "Date", width: "12%" },
  { key: "reference", header: "Reference", width: "14%" },
  { key: "method", header: "Method", width: "16%" },
  { key: "vendor", header: "Vendors / Invoices", width: "28%" },
  { key: "amount", header: "Amount", width: "14%" },
  { key: "status", header: "Status", width: "16%" },
];

const dateFormatter = new Intl.DateTimeFormat("en-CA"); // yyyy-mm-dd, matches the design

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const STATUS_VARIANT = {
  Completed: "info",
  Processing: "neutral",
  Draft: "danger",
};

function PaymentsTable({ items, isLoading, error, page, totalPages, total, onPageChange }) {
  return (
    <Card noPadding className={styles.cardOverride}>
      <div className={styles.toolbar}>
        <h2 className={styles.title}>Payment History</h2>
        <div className={styles.toolbarActions}>
          <Button variant="secondary" icon={<FilterIcon />}>
            Filter
          </Button>
          <ExportButton onExport={exportPaymentsCsv} fileNamePrefix="payments" label="Export" />
        </div>
      </div>

      {error ? (
        <div className={styles.errorState}>
          <strong>Couldn't load payments.</strong>
          <span>{error}</span>
        </div>
      ) : (
        <Table
          columns={COLUMNS}
          rows={items}
          isLoading={isLoading}
          emptyMessage="No payments match your search."
          keyExtractor={(row) => row.id}
          renderRow={(payment, _index, key) => (
            <tr key={key} className={styles.row}>
              <td className={styles.cell}>{dateFormatter.format(new Date(payment.date))}</td>
              <td className={styles.cell}>
                <span className={styles.reference}>{payment.id}</span>
              </td>
              <td className={styles.cell}>
                <PaymentMethod method={payment.method} />
              </td>
              <td className={styles.cell}>
                <div className={styles.vendorName}>{payment.vendorName}</div>
                <div className={styles.invoiceRefs}>
                  Inv #{payment.invoiceRefs.join(", #")}
                </div>
              </td>
              <td className={styles.cell}>
                <strong>{currencyFormatter.format(payment.amount)}</strong>
              </td>
              <td className={styles.cell}>
                <Badge label={payment.status} variant={STATUS_VARIANT[payment.status] || "neutral"} />
              </td>
            </tr>
          )}
        />
      )}

      {!error && totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalResults={total}
          resultsOnPage={items.length}
        />
      )}
    </Card>
  );
}

PaymentsTable.propTypes = {
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaymentsTable;
