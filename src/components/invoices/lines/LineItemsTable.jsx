import React from "react";
import PropTypes from "prop-types";
import Card from "../../common/Card";
import { PlusIcon } from "../../common/icons";
import { GL_ACCOUNT_OPTIONS } from "../../../constants/formOptions";
import styles from "./LineItemsTable.module.css";

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 20h4L18.5 9.5a1.5 1.5 0 000-2.1L17.6 6.4a1.5 1.5 0 00-2.1 0L4 17v3z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M13.5 8.5l2 2" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function glAccountLabel(code) {
  const match = GL_ACCOUNT_OPTIONS.find((opt) => opt.value === code);
  return match ? match.label : code;
}

function LineItemsTable({ items, onEditItem, onRemoveItem, onAddRowClick }) {
  return (
    <Card noPadding className={styles.card}>
      <div className={styles.toolbar}>
        <h3 className={styles.title}>Line Items</h3>
        <span className={styles.countBadge}>Total Items: {items.length}</span>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Qty</th>
            <th className={styles.th}>Unit Price</th>
            <th className={styles.th}>GL Account</th>
            <th className={styles.th}>Tax</th>
            <th className={styles.th}>Amount</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={7} className={styles.emptyCell}>
                No line items yet.
              </td>
            </tr>
          )}

          {items.map((item) => (
            <tr key={item.id} className={styles.row}>
              <td className={styles.cell}>{item.description}</td>
              <td className={styles.cell}>{Number(item.qty).toFixed(2)}</td>
              <td className={styles.cell}>{currencyFormatter.format(item.unitPrice)}</td>
              <td className={styles.cell}>
                <span className={styles.glCode}>{item.glAccount}</span> -{" "}
                {glAccountLabel(item.glAccount).replace(`${item.glAccount} - `, "")}
              </td>
              <td className={styles.cell}>{item.taxRatePct}%</td>
              <td className={`${styles.cell} ${styles.amountCell}`}>
                {currencyFormatter.format(item.qty * item.unitPrice)}
              </td>
              <td className={`${styles.cell} ${styles.actionsCell}`}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => onEditItem(item)}
                  aria-label={`Edit ${item.description}`}
                >
                  <EditIcon />
                </button>
                <button
                  type="button"
                  className={`${styles.iconButton} ${styles.danger}`}
                  onClick={() => onRemoveItem(item.id)}
                  aria-label={`Delete ${item.description}`}
                >
                  <TrashIcon />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" className={styles.addRow} onClick={onAddRowClick}>
        <PlusIcon /> Add New Row
      </button>
    </Card>
  );
}

LineItemsTable.propTypes = {
  items: PropTypes.array.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onAddRowClick: PropTypes.func,
};

export default LineItemsTable;
