import React from "react";
import PropTypes from "prop-types";
import Card from "../../common/Card";
import Button from "../../common/Button";
import Select from "../../common/Select";
import { GL_ACCOUNT_OPTIONS, TAX_RATE_OPTIONS } from "../../../constants/formOptions";
import { PlusIcon } from "../../common/icons";
import styles from "./LineItemsEditor.module.css";

const TrashIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0v13a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z"
      stroke="currentColor"
      strokeWidth="1.7"
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

/**
 * Fully editable table: every cell is an input/select bound to the
 * line item passed in. Totals are not computed here - the parent
 * page owns `rowAmounts` (see useLineItems.js) and passes the
 * pre-computed amount per row.
 */
function LineItemsEditor({ items, rowAmounts, onUpdateItem, onRemoveItem, onAddItem }) {
  return (
    <Card noPadding className={styles.card}>
      <div className={styles.toolbar}>
        <h3 className={styles.title}>Billable Line Items</h3>
        <Button variant="primary" size="sm" icon={<PlusIcon />} onClick={onAddItem}>
          Add Line
        </Button>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ width: "28%" }}>Description</th>
              <th className={styles.th} style={{ width: "8%" }}>Qty</th>
              <th className={styles.th} style={{ width: "14%" }}>Unit Price</th>
              <th className={styles.th} style={{ width: "18%" }}>GL Account</th>
              <th className={styles.th} style={{ width: "14%" }}>Tax Rate</th>
              <th className={styles.th} style={{ width: "12%" }}>Amount</th>
              <th className={styles.th} style={{ width: "6%" }} />
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.emptyCell}>
                  No line items yet. Click "Add Line" to bill your first item.
                </td>
              </tr>
            )}

            {items.map((item) => (
              <tr key={item.id} className={styles.row}>
                <td className={styles.cell}>
                  <input
                    className={styles.inlineInput}
                    value={item.description}
                    placeholder="Item description"
                    onChange={(e) => onUpdateItem(item.id, { description: e.target.value })}
                  />
                </td>
                <td className={styles.cell}>
                  <input
                    className={styles.inlineInput}
                    type="number"
                    min="0"
                    step="1"
                    value={item.qty}
                    onChange={(e) => onUpdateItem(item.id, { qty: Number(e.target.value) })}
                  />
                </td>
                <td className={styles.cell}>
                  <div className={styles.priceInput}>
                    <span>$</span>
                    <input
                      className={styles.inlineInput}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => onUpdateItem(item.id, { unitPrice: Number(e.target.value) })}
                    />
                  </div>
                </td>
                <td className={styles.cell}>
                  <Select
                    value={item.glAccount}
                    onChange={(e) => onUpdateItem(item.id, { glAccount: e.target.value })}
                    options={GL_ACCOUNT_OPTIONS}
                    placeholder="Select account"
                  />
                </td>
                <td className={styles.cell}>
                  <Select
                    value={String(item.taxRatePct)}
                    onChange={(e) => onUpdateItem(item.id, { taxRatePct: Number(e.target.value) })}
                    options={TAX_RATE_OPTIONS}
                  />
                </td>
                <td className={`${styles.cell} ${styles.amountCell}`}>
                  {currencyFormatter.format(rowAmounts[item.id] || 0)}
                </td>
                <td className={`${styles.cell} ${styles.actionsCell}`}>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => onRemoveItem(item.id)}
                    aria-label="Remove line item"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

LineItemsEditor.propTypes = {
  items: PropTypes.array.isRequired,
  rowAmounts: PropTypes.object.isRequired,
  onUpdateItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
};

export default LineItemsEditor;
