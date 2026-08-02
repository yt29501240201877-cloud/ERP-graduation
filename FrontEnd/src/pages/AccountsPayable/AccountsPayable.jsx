import GlowBtn from "../../components/ui/GlowBtn/GlowBtn";
import SolidBtn from "../../components/ui/SolidBtn/SolidBtn";
import style from "./AccountsPayable.module.css";

/**
 * Flugur ERP — Accounts Payable (Payments)
 * Re-skinned with the Flugur ERP dark design system.
 * Architecture matches the original SalesLedger screen 1:1 —
 * only visual language (color, type, surfaces) has been swapped.
 */

const c = {
  bg: "#0A0E1A",
  bgSidebar: "#0D1220",
  bgTop: "#0D1220",
  card: "#111827",
  cardAlt: "#0F1521",
  border: "#1F2937",
  textPrimary: "#F9FAFB",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
  accent: "#6366F1",
  accentSoft: "#6366F11A",
  success: "#22C55E",
  successSoft: "#22C55E1A",
  warning: "#F59E0B",
  warningSoft: "#F59E0B1A",
  danger: "#EF4444",
  dangerSoft: "#EF44441A",
};

const payments = [
  {
    date: "2023-10-24",
    ref: "BT-001294",
    method: "Bank Transfer",
    methodIcon: <i className="bi bi-bank2"></i>,
    vendor: "Global Logistics Inc.",
    inv: "Inv #8821, #8822",
    amount: "$12,450.00",
    status: "Completed",
    statusColors: [c.accentSoft, c.accent],
  },
  {
    date: "2023-10-23",
    ref: "CK-00992",
    method: "Check",
    methodIcon: <i className="bi bi-card-checklist"></i>,
    vendor: "Tech Solutions Ltd.",
    inv: "Inv #4500-B",
    amount: "$3,200.00",
    status: "Processing",
    statusColors: ["#9CA3AF1A", c.textSecondary],
  },
  {
    date: "2023-10-22",
    ref: "ON-11029",
    method: "Online",
    methodIcon: <i className="bi bi-globe"></i>,
    vendor: "Office Supply Co.",
    inv: "Inv #OFF-992",
    amount: "$842.25",
    status: "Draft",
    statusColors: [c.dangerSoft, c.danger],
  },
];

export default function AccountsPayable() {
  return (
    <div className={style.page}>

    

      {/* Main */}
      <div className={style.main}>
      

        <div className={style.container}>
          <div className={style.headerRow}>
            <div>
              <h1 className={style.title}>Accounts Payable</h1>
              <div className={style.subtitle}>Manage vendor disbursements and transaction history</div>
            </div>
            <GlowBtn icon="bi-plus-lg" text="New Payment" className="fs-6" />
          </div>

          {/* Stat cards */}
          <div className={style.statGrid}>
            <div className={style.statCard}>
              <div className={style.statHeadRow}>
                <div className={style.statLabel}>Total Outstanding</div>
                <div className={style.statIcon}>
                  <i className="bi bi-credit-card"></i>
                </div>
              </div>
              <div className={style.statValue}>$248,590.22</div>
              <div className={style.statSubUp}>
                <i className="bi bi-graph-up-arrow"></i> +12.4% from last month
              </div>
            </div>
            <div className={style.statCard}>
              <div className={style.statHeadRow}>
                <div className={style.statLabel}>Processing Payments</div>
                <div className={style.statIcon}>
                  <i className="bi bi-clipboard"></i>
                </div>
              </div>
              <div className={style.statValue}>14</div>
              <div className={style.statSub}>Totaling $42,300.00</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statHeadRow}>
                <div className={style.statLabel}>Recent Completions</div>
                <div className={style.statIcon}>
                  <i className="bi bi-shield"></i>
                </div>
              </div>
              <div className={style.statValue}>128</div>
              <div className={style.statSubGood}>
                <i className="bi bi-check-circle"></i> All reconciled for Q3
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className={style.tableCard}>
            <div className={style.tableHeaderRow}>
              <div className={style.tableHeaderTitle}>Payment History</div>
              <div className={style.toolbarRight}>
                <SolidBtn icon="bi-funnel" text="Filter" />
                <SolidBtn icon="bi-download" text="Export" />
              </div>
            </div>

            <div className={style.theadRow}>
              <div className={style.th}>Date</div>
              <div className={style.th}>Reference</div>
              <div className={style.th}>Method</div>
              <div className={style.th}>Vendors / Invoices</div>
              <div className={style.th}>Amount</div>
              <div className={style.th}>Status</div>
            </div>

            {payments.map((p, i) => (
              <div key={p.ref} className={i === payments.length - 1 ? style.trLast : style.tr}>
                <div className={style.dateCell}>{p.date}</div>
                <div className={style.refCell}>{p.ref}</div>
                <div className={style.methodCell}>
                  {p.methodIcon} {p.method}
                </div>
                <div>
                  <div className={style.vendorName}>{p.vendor}</div>
                  <div className={style.vendorSub}>{p.inv}</div>
                </div>
                <div className={style.amountCell}>{p.amount}</div>
                <div>
                  <span
                    className={style.badge}
                    style={{ background: p.statusColors[0], color: p.statusColors[1] }}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}