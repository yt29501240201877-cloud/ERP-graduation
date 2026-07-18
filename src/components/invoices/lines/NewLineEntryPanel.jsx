import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "../../common/Card";
import Button from "../../common/Button";
import FormField from "../../common/FormField";
import TextArea from "../../common/TextArea";
import Input from "../../common/Input";
import Select from "../../common/Select";
import { GL_ACCOUNT_OPTIONS, TAX_RATE_OPTIONS } from "../../../constants/formOptions";
import styles from "./NewLineEntryPanel.module.css";

const SaveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 4h11l3 3v13a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M8 4v5h7V4M8 14h8v6H8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const EMPTY_DRAFT = { description: "", qty: 1, unitPrice: 0, glAccount: "", taxRatePct: 10 };

/**
 * `editingItem` (optional): when set, the panel is pre-filled for
 * editing that row instead of creating a new one. `onSave` receives
 * the finished draft; the parent decides whether that's an add or
 * an update.
 */
function NewLineEntryPanel({ editingItem, onSave, onClear }) {
  const [draft, setDraft] = useState(editingItem || EMPTY_DRAFT);

  useEffect(() => {
    setDraft(editingItem || EMPTY_DRAFT);
  }, [editingItem]);

  const set = (field) => (e) => {
    const raw = e.target.value;
    const value = field === "qty" || field === "unitPrice" || field === "taxRatePct" ? Number(raw) : raw;
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!draft.description.trim()) return;
    onSave(draft);
    setDraft(EMPTY_DRAFT);
  };

  const handleClear = () => {
    setDraft(EMPTY_DRAFT);
    onClear?.();
  };

  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>{editingItem ? "Edit Line Entry" : "New Line Entry"}</h3>

      <FormField label="Description" htmlFor="line-description">
        <TextArea
          id="line-description"
          value={draft.description}
          onChange={set("description")}
          placeholder="Enter item details..."
          rows={3}
        />
      </FormField>

      <div className={styles.row2}>
        <FormField label="Quantity" htmlFor="line-qty">
          <Input id="line-qty" type="number" min="0" step="1" value={draft.qty} onChange={set("qty")} />
        </FormField>
        <FormField label="Unit Price" htmlFor="line-price">
          <Input id="line-price" type="number" min="0" step="0.01" prefix="$" value={draft.unitPrice} onChange={set("unitPrice")} />
        </FormField>
      </div>

      <FormField label="GL Account Selection" htmlFor="line-gl">
        <Select
          id="line-gl"
          value={draft.glAccount}
          onChange={set("glAccount")}
          options={GL_ACCOUNT_OPTIONS}
          placeholder="Select GL Account"
        />
      </FormField>

      <FormField label="Tax Rate Selection" htmlFor="line-tax">
        <Select
          id="line-tax"
          value={String(draft.taxRatePct)}
          onChange={set("taxRatePct")}
          options={TAX_RATE_OPTIONS}
        />
      </FormField>

      <div className={styles.actions}>
        <Button variant="primary" icon={<SaveIcon />} onClick={handleSave} className={styles.fullWidth}>
          Save Line Item
        </Button>
        <Button variant="secondary" onClick={handleClear} className={styles.fullWidth}>
          Clear Fields
        </Button>
      </div>
    </Card>
  );
}

NewLineEntryPanel.propTypes = {
  editingItem: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onClear: PropTypes.func,
};

export default NewLineEntryPanel;
