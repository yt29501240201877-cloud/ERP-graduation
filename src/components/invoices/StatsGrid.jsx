import React from "react";
import PropTypes from "prop-types";
import StatCard from "../common/StatCard";
import styles from "./StatsGrid.module.css";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const TrendUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: "-1px" }}>
    <path
      d="M4 16l6-6 4 4 6-8M14 6h6v6"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function ProgressBar({ value, max }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={styles.progressTrack} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.progressFill} style={{ width: `${pct}%` }} />
    </div>
  );
}

/**
 * Renders the 4-card stats row. When `isLoading` is true, shows a
 * lightweight skeleton instead of stale/zeroed numbers.
 */
function StatsGrid({ summary, isLoading }) {
  if (isLoading || !summary) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
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
        footer={
          <span className={styles.trendUp}>
            <TrendUpIcon /> {summary.totalOutstandingChangePct}% vs last month
          </span>
        }
      />

      <StatCard
        label="Pending Approval"
        value={summary.pendingApprovalCount}
        footer={
          <span className={styles.muted}>
            Valued at {currencyFormatter.format(summary.pendingApprovalValue)}
          </span>
        }
      />

      <StatCard
        label="Due This Week"
        value={summary.dueThisWeekCount}
        footer={<ProgressBar value={summary.dueThisWeekCount} max={summary.dueThisWeekCapacity} />}
      />

      <StatCard
        label="Average Pay Cycle"
        value={`${summary.averagePayCycleDays} Days`}
        footer={
          <span className={styles.muted}>
            Target: {summary.averagePayCycleTargetDays.toFixed(1)} days
          </span>
        }
      />
    </div>
  );
}

StatsGrid.propTypes = {
  summary: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default StatsGrid;
