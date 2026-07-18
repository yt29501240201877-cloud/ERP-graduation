import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InvoiceHeaderBar from "../components/invoices/lines/InvoiceHeaderBar";
import LineItemsTable from "../components/invoices/lines/LineItemsTable";
import NewLineEntryPanel from "../components/invoices/lines/NewLineEntryPanel";
import LinesFooterSummary from "../components/invoices/lines/LinesFooterSummary";
import useLineItems from "../hooks/useLineItems";
import styles from "./InvoiceLinesPage.module.css";

// Stand-in for a real GET /invoices/:id fetch - swap for an API call
// once a backend is connected (see services/invoiceService.js).
function useMockInvoiceHeader(invoiceId) {
  return {
    id: invoiceId || "INV-2024-0892",
    vendorName: "Global Logistics Solutions Inc.",
    invoiceDate: "2023-10-24",
    dueDate: "2023-11-23",
  };
}

function InvoiceLinesPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const invoiceHeader = useMockInvoiceHeader(invoiceId);

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);

  const { items, addItem, updateItem, removeItem, totals } = useLineItems([
    { description: "Standard Shipping Fees (Domestic)", qty: 1, unitPrice: 450, glAccount: "6100", taxRatePct: 10 },
    { description: "Pallet Storage - Warehouse B", qty: 5, unitPrice: 25, glAccount: "6210", taxRatePct: 0 },
    { description: "Priority Handling Surcharge", qty: 2, unitPrice: 75, glAccount: "6100", taxRatePct: 10 },
  ]);

  const editingItem = items.find((item) => item.id === editingItemId) || null;

  const handleSavePanel = (draft) => {
    if (editingItemId) {
      updateItem(editingItemId, draft);
      setEditingItemId(null);
    } else {
      addItem(draft);
    }
  };

  const handleSaveProgress = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleFinalize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/invoices");
    }, 600);
  };

  return (
    <div className={styles.page}>
      <InvoiceHeaderBar
        invoice={invoiceHeader}
        onEditHeader={() => navigate("/invoices/new")}
        onSaveProgress={handleSaveProgress}
        isSaving={isSaving}
      />

      <div className={styles.grid}>
        <LineItemsTable
          items={items}
          onEditItem={(item) => setEditingItemId(item.id)}
          onRemoveItem={(id) => {
            removeItem(id);
            if (editingItemId === id) setEditingItemId(null);
          }}
          onAddRowClick={() => setEditingItemId(null)}
        />

        <NewLineEntryPanel
          editingItem={editingItem}
          onSave={handleSavePanel}
          onClear={() => setEditingItemId(null)}
        />
      </div>

      <LinesFooterSummary
        subtotal={totals.subtotal}
        taxAmount={totals.taxAmount}
        total={totals.total}
        onCancelDraft={() => navigate("/invoices")}
        onFinalize={handleFinalize}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default InvoiceLinesPage;
