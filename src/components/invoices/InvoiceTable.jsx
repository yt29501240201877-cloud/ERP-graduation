import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import Table from "../common/Table";
import Badge from "../common/Badge";
import Pagination from "../common/Pagination";
import FilterButton from "./FilterButton";
import InvoiceRowActions from "./InvoiceRowActions";
import styles from "./InvoiceTable.module.css";

const TABS = [
  { key: "all", label: "All Invoices" },
  { key: "pending", label: "Pending" },
  { key: "paid", label: "Paid" },
];

const COLUMNS = [
  { key: "id", header: "Invoice #", width: "16%" },
  { key: "vendor", header: "Vendor", width: "26%" },
  { key: "date", header: "Date", width: "13%" },
  { key: "due", header: "Due", width: "13%" },
  { key: "amount", header: "Amount", width: "14%", align: "left" },
  { key: "status", header: "Status", width: "12%" },
  { key: "actions", header: "", width: "6%", align: "right" },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const STATUS_VARIANT = {
  PENDING: "info",
  PAID: "success",
  DRAFT: "neutral",
};

function VendorCell({ vendor }) {
  return (
    <div className={styles.vendorCell}>
      <span className={styles.avatar}>{vendor.initials}</span>
      <div>
        <div className={styles.vendorName}>{vendor.name}</div>
        <div className={styles.vendorId}>Vendor ID: {vendor.vendorId}</div>
      </div>
    </div>
  );
}

function InvoiceTable({
  tab,
  onTabChange,
  items,
  isLoading,
  error,
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}) {
  const navigate = useNavigate();
  const goToLines = (invoice) => navigate(`/invoices/${invoice.id}/lines`);

  return (
    <Card noPadding className={styles.cardOverride}>
      <div className={styles.toolbar}>
        <div className={styles.tabs} role="tablist">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              className={`${styles.tab} ${tab === t.key ? styles.activeTab : ""}`}
              onClick={() => onTabChange(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <FilterButton />
      </div>

      {error ? (
        <div className={styles.errorState}>
          <strong>Couldn't load invoices.</strong>
          <span>{error}</span>
        </div>
      ) : (
        <Table
          columns={COLUMNS}
          rows={items}
          isLoading={isLoading}
          emptyMessage="No invoices match your search or filters."
          keyExtractor={(row) => row.id}
          renderRow={(invoice, _index, key) => (
            <tr key={key} className={styles.row}>
              <td className={styles.cell}>
                <span className={styles.invoiceId}>{invoice.id}</span>
              </td>
              <td className={styles.cell}>
                <VendorCell vendor={invoice.vendor} />
              </td>
              <td className={styles.cell}>{dateFormatter.format(new Date(invoice.invoiceDate))}</td>
              <td className={styles.cell}>{dateFormatter.format(new Date(invoice.dueDate))}</td>
              <td className={styles.cell}>
                <strong>{currencyFormatter.format(invoice.amount)}</strong>
              </td>
              <td className={styles.cell}>
                <Badge label={invoice.status} variant={STATUS_VARIANT[invoice.status] || "neutral"} />
              </td>
              <td className={`${styles.cell} ${styles.actionsCell}`}>
                <InvoiceRowActions invoice={invoice} onView={goToLines} onEdit={goToLines} />
              </td>
            </tr>
          )}
        />
      )}

      {!error && (
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

InvoiceTable.propTypes = {
  tab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
};

export default InvoiceTable;
