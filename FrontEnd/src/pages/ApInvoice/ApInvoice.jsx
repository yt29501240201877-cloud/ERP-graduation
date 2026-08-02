import style from "./ApInvoice.module.css";
import { Link } from "react-router";

/**
 * Flugur ERP — Invoices (Accounts Payable)
 * Re-skinned with the Flugur ERP dark design system.
 * Architecture matches the original SalesLedger / ERP Finance screen 1:1 —
 * only visual language (color, type, surfaces) has been swapped.
 */

const c = {
  accentSoft: "#6366F11A",
  accent: "#6366F1",
  successSoft: "#22C55E1A",
  success: "#22C55E",
  neutralSoft: "#9CA3AF1A",
  neutral: "#9CA3AF",
};

const invoices = [
  {
    num: "INV-2023-0045",
    initials: "NL",
    vendor: "Nexus Logistics",
    vendorId: "Vendor ID: V-9912",
    date: "Oct 24, 2023",
    due: "Nov 23, 2023",
    amount: "$12,450.00",
    status: "PENDING",
    statusColors: [c.accentSoft, c.accent],
  },
  {
    num: "INV-2023-0042",
    initials: "AS",
    vendor: "Apex Solutions",
    vendorId: "Vendor ID: V-4482",
    date: "Oct 22, 2023",
    due: "Nov 21, 2023",
    amount: "$3,120.50",
    status: "PAID",
    statusColors: [c.successSoft, c.success],
  },
  {
    num: "INV-2023-0048",
    initials: "GC",
    vendor: "Global Connect",
    vendorId: "Vendor ID: V-1120",
    date: "Oct 26, 2023",
    due: "Nov 10, 2023",
    amount: "$890.00",
    status: "DRAFT",
    statusColors: [c.neutralSoft, c.neutral],
  },
];

export default function ApInvoice() {
  return (
    <div className={style.page}>

      {/* Main */}
      <div className={style.main}>
       

        <div className={style.container}>
          <div className={style.headerRow}>
      
            <div className={style.headerActions}>
              <button className={style.btnGhost}>
                <i className="bi bi-download"></i> EXPORT CSV
              </button>
              <Link className={style.btnPrimary} to='/createInvoice'>
                <i className="bi bi-plus-lg"></i> NEW INVOICE
              </Link>
            </div>
          </div>

          {/* Stat cards */}
          <div className={style.statGrid}>
            <div className={style.statCard}>
              <div className={style.statLabel}>Total Outstanding</div>
              <div className={style.statValue}>$412,890.00</div>
              <div className={style.statSubUp}>
                <i className="bi bi-graph-up-arrow"></i> 12% vs last month
              </div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>Pending Approval</div>
              <div className={style.statValue}>24</div>
              <div className={style.statSub}>Valued at $45,200.00</div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>Due This Week</div>
              <div className={style.statValue}>8</div>
              <div className={style.progressTrack}>
                <div className={style.progressFill} style={{ width: "65%" }} />
              </div>
            </div>
            <div className={style.statCard}>
              <div className={style.statLabel}>Average Pay Cycle</div>
              <div className={style.statValue}>14.2 DAYS</div>
              <div className={style.statSub}>Target: 15.0 days</div>
            </div>
          </div>

          {/* Table */}
          <div className={style.tableCard}>
            <div className={style.tabsRow}>
              <div className={style.tabs}>
                <div className={style.tabActive}>All Invoices</div>
                <div className={style.tab}>Pending</div>
                <div className={style.tab}>Paid</div>
              </div>
              <div className={style.tabIcons}>
                <i className="bi bi-filter"></i>
                <i className="bi bi-arrow-left-right"></i>
              </div>
            </div>

            <div className={style.theadRow}>
              <div className={style.th}>Invoice #</div>
              <div className={style.th}>Vendor</div>
              <div className={style.th}>Date</div>
              <div className={style.th}>Due</div>
              <div className={style.th}>Amount</div>
              <div className={style.th}>Status</div>
              <div className={style.th}></div>
            </div>

            {invoices.map((inv, i) => (
              <div key={inv.num} className={i === invoices.length - 1 ? style.trLast : style.tr}>
                <div className={style.invoiceNum}>{inv.num}</div>
                <div className={style.vendorCell}>
                  <div className={style.vendorAvatar}>{inv.initials}</div>
                  <div>
                    <div className={style.vendorName}>{inv.vendor}</div>
                    <div className={style.vendorSub}>{inv.vendorId}</div>
                  </div>
                </div>
                <div className={style.dateCell}>{inv.date}</div>
                <div className={style.dateCell}>{inv.due}</div>
                <div className={style.amountCell}>{inv.amount}</div>
                <div>
                  <span
                    className={style.badge}
                    style={{ background: inv.statusColors[0], color: inv.statusColors[1] }}
                  >
                    {inv.status}
                  </span>
                </div>
                <div className={style.actionsCell}>
                  <i className="bi bi-three-dots-vertical"></i>
                </div>
              </div>
            ))}

            <div className={style.tableFooter}>
              <div className={style.showingText}>Showing 3 of 124 results</div>
              <div className={style.pagination}>
                <div className={style.pageBtn}>
                  <i className="bi bi-chevron-left"></i>
                </div>
                <div className={style.pageBtnActive}>1</div>
                <div className={style.pageBtn}>2</div>
                <div className={style.pageBtn}>3</div>
                <div className={style.pageBtn}>
                  <i className="bi bi-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}