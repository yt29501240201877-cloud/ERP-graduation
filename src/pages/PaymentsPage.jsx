import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import DashboardHeader from "../components/invoices/DashboardHeader";
import PaymentsStatsGrid from "../components/payments/PaymentsStatsGrid";
import PaymentsTable from "../components/payments/PaymentsTable";
import Button from "../components/common/Button";
import { PlusIcon } from "../components/common/icons";
import usePayments from "../hooks/usePayments";
import { fetchPaymentSummary } from "../services/paymentService";
import styles from "./PaymentsPage.module.css";

function PaymentsPage() {
  const { searchTerm } = useOutletContext();

  const { items, total, page, totalPages, isLoading, error, setPage } = usePayments(searchTerm);

  const [summary, setSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchPaymentSummary()
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
        title="Accounts Payable"
        subtitle="Manage vendor disbursements and transaction history"
        actions={
          <Button variant="primary" icon={<PlusIcon />}>
            New Payment
          </Button>
        }
      />

      <PaymentsStatsGrid summary={summary} isLoading={isSummaryLoading} />

      <PaymentsTable
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

export default PaymentsPage;
