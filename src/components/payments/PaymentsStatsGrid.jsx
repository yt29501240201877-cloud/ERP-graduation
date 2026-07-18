import React from "react";
import PropTypes from "prop-types";
import StatCard from "../common/StatCard";
import { WalletIcon, ClipboardClockIcon, ShieldCheckIcon, TrendUpIcon, CheckCircleIcon } from "../common/icons";
import styles from "./PaymentsStatsGrid.module.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

function PaymentsStatsGrid({ summary, isLoading }) {
  if (isLoading || !summary) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      <StatCard
        label="Total Outstanding"
        value={currencyFormatter.format(summary.totalOutstanding)}
        icon={<WalletIcon />}
        footer={
          <span className={styles.trendUp}>
            <TrendUpIcon /> +{summary.totalOutstandingChangePct}% from last month
          </span>
        }
      />

      <StatCard
        label="Processing Payments"
        value={summary.processingCount}
        icon={<ClipboardClockIcon />}
        footer={<span className={styles.muted}>Totaling {currencyFormatter.format(summary.processingValue)}</span>}
      />

      <StatCard
        label="Recent Completions"
        value={summary.recentCompletions}
        icon={<ShieldCheckIcon />}
        footer={
          <span className={styles.infoNote}>
            <CheckCircleIcon /> {summary.recentCompletionsNote}
          </span>
        }
      />
    </div>
  );
}

PaymentsStatsGrid.propTypes = {
  summary: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default PaymentsStatsGrid;
