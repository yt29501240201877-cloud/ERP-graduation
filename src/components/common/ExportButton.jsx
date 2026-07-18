import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import { DownloadIcon } from "./icons";

/**
 * Calls `onExport` (which must resolve to a Blob), then downloads it
 * client-side via a temporary object URL, revoked immediately after
 * use. Used by both the Invoices and Payments pages so the
 * download/loading-state plumbing exists in exactly one place.
 */
function ExportButton({ onExport, fileNamePrefix = "export", label = "Export", loadingLabel = "Exporting..." }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await onExport();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileNamePrefix}-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Export failed:", err?.message || err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="secondary" icon={<DownloadIcon />} onClick={handleExport} disabled={isExporting}>
      {isExporting ? loadingLabel : label}
    </Button>
  );
}

ExportButton.propTypes = {
  onExport: PropTypes.func.isRequired,
  fileNamePrefix: PropTypes.string,
  label: PropTypes.string,
  loadingLabel: PropTypes.string,
};

export default ExportButton;
