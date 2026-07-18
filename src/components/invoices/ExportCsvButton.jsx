import React from "react";
import ExportButton from "../common/ExportButton";
import { exportInvoicesCsv } from "../../services/invoiceService";

function ExportCsvButton() {
  return (
    <ExportButton
      onExport={exportInvoicesCsv}
      fileNamePrefix="invoices"
      label="Export CSV"
    />
  );
}

export default ExportCsvButton;
