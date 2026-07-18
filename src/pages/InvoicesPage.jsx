import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/invoices/DashboardHeader";
import StatsGrid from "../components/invoices/StatsGrid";
import InvoiceTable from "../components/invoices/InvoiceTable";
import ExportCsvButton from "../components/invoices/ExportCsvButton";
import NewInvoiceButton from "../components/invoices/NewInvoiceButton";
import useInvoices from "../hooks/useInvoices";
import { fetchInvoiceSummary } from "../services/invoiceService";
import styles from "./InvoicesPage.module.css";

function InvoicesPage() {
  const { searchTerm } = useOutletContext();
  const navigate = useNavigate();

  const {
    items,
    total,
    page,
    totalPages,
    isLoading,
    error,
    tab,
    setTab,
    setPage,
  } = useInvoices(searchTerm);

  const [summary, setSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchInvoiceSummary()
      .then((data) => {
        if (isMounted) setSummary(data);
      })
      .catch(() => {
        if (isMounted) setSummary(null);
      })
      .finally(() => {
        if (isMounted) setIsSummaryLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.page}>
      <DashboardHeader
        title="Invoices"
        subtitle="Manage vendor billing and payment processing cycles."
        actions={
          <>
            <ExportCsvButton />
            <NewInvoiceButton onClick={() => navigate("/invoices/new")} />
          </>
        }
      />

      <StatsGrid summary={summary} isLoading={isSummaryLoading} />

      <InvoiceTable
        tab={tab}
        onTabChange={setTab}
        items={items}
        isLoading={isLoading}
        error={error}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
      />
    </div>
  );
}

export default InvoicesPage;
