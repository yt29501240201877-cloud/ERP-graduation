import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import Stepper from "../components/common/Stepper";
import FormField from "../components/common/FormField";
import TextArea from "../components/common/TextArea";
import FileDropzone from "../components/common/FileDropzone";
import InvoiceMetaForm from "../components/invoices/create/InvoiceMetaForm";
import LineItemsEditor from "../components/invoices/create/LineItemsEditor";
import FinancialSummaryCard from "../components/invoices/create/FinancialSummaryCard";
import WizardFooter from "../components/invoices/create/WizardFooter";
import useLineItems from "../hooks/useLineItems";
import styles from "./CreateInvoicePage.module.css";

const STEPS = ["Draft", "Review", "Approved"];

function generateInvoiceNumber() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-2023-${random}`;
}

function CreateInvoicePage() {
  const navigate = useNavigate();

  const [meta, setMeta] = useState({
    vendorId: "",
    invoiceNumber: generateInvoiceNumber(),
    accountingPeriod: "fy23-q4",
    invoiceDate: "",
    dueDate: "",
    paymentTerms: "net30",
  });
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { items, addItem, updateItem, removeItem, totals, rowAmounts } = useLineItems([
    { description: "Cloud Hosting Services - Oct", qty: 1, unitPrice: 1250, glAccount: "6200", taxRatePct: 7 },
    { description: "Premium Support Add-on", qty: 1, unitPrice: 250, glAccount: "6200", taxRatePct: 7 },
  ]);

  const handleMetaChange = (field, value) => setMeta((prev) => ({ ...prev, [field]: value }));

  // Weighted-average tax rate purely for the summary card's "(x%)" label.
  const effectiveTaxRatePct = totals.subtotal > 0 ? Math.round((totals.taxAmount / totals.subtotal) * 100) : 0;

  const handleSaveDraft = () => {
    // eslint-disable-next-line no-console
    console.log("Saving draft:", { meta, items, notes, totals });
    navigate("/invoices");
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // eslint-disable-next-line no-console
    console.log("Submitting for approval:", { meta, items, notes, totals });
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/invoices");
    }, 600);
  };

  return (
    <div className={styles.page}>
      <Card noPadding className={styles.stepperCard}>
        <Stepper steps={STEPS} activeIndex={0} />
      </Card>

      <InvoiceMetaForm
        values={meta}
        onChange={handleMetaChange}
        onRegenerateInvoiceNumber={() => handleMetaChange("invoiceNumber", generateInvoiceNumber())}
      />

      <LineItemsEditor
        items={items}
        rowAmounts={rowAmounts}
        onUpdateItem={updateItem}
        onRemoveItem={removeItem}
        onAddItem={addItem}
      />

      <div className={styles.bottomGrid}>
        <Card>
          <FormField label="Internal Notes" htmlFor="notes">
            <TextArea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any internal context for the approval team..."
              rows={7}
            />
          </FormField>
        </Card>

        <FinancialSummaryCard
          subtotal={totals.subtotal}
          taxAmount={totals.taxAmount}
          taxRatePct={effectiveTaxRatePct}
          total={totals.total}
          note="Values are calculated in real-time based on line items."
        />
      </div>

      <FileDropzone
        label="Upload Invoice PDF/Image"
        hint="Drag and drop or click to browse"
        accept="application/pdf,image/*"
      />

      <WizardFooter
        onCancel={() => navigate("/invoices")}
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default CreateInvoicePage;
