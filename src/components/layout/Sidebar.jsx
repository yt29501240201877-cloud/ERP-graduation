import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

/* Inline icon set - no external icon library dependency to keep the
   bundle small and avoid pulling in third-party SVGs from the network. */
const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="8" height="8" rx="1.5" fill="currentColor" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" fill="currentColor" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" fill="currentColor" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" fill="currentColor" />
    </svg>
  ),
  invoices: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 2h9l5 5v15a1 1 0 01-1 1H6a1 1 0 01-1-1V3a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.8"
        fill="none"
      />
      <path d="M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  payments: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="6" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ),
  customers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M21 20c0-2.6-1.8-4.8-4.2-5.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  reports: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 16v-4M12 16V8M16 16v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M19.4 13a7.97 7.97 0 000-2l2-1.5-2-3.4-2.4.6a8 8 0 00-1.7-1L15 3h-4l-.3 2.7a8 8 0 00-1.7 1l-2.4-.6-2 3.4L6.6 11a7.97 7.97 0 000 2l-2 1.5 2 3.4 2.4-.6a8 8 0 001.7 1L11 21h4l.3-2.7a8 8 0 001.7-1l2.4.6 2-3.4-2-1.5z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  ),
  support: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.5 9.5a2.5 2.5 0 114.2 1.8c-.9.8-1.7 1.2-1.7 2.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 17l5-5-5-5M20 12H9M12 3H6a1 1 0 00-1 1v16a1 1 0 001 1h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

/**
 * `path: null` items are visual-only in this build (no page behind
 * them yet). Give them a real route in AppRouter.jsx and swap
 * `path: null` for the real path to make them navigable.
 */
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: icons.dashboard, path: null },
  { key: "invoices", label: "Invoices", icon: icons.invoices, path: "/invoices" },
  { key: "payments", label: "Payments", icon: icons.payments, path: "/payments" },
  { key: "customers", label: "Customers", icon: icons.customers, path: null },
  { key: "reports", label: "Revenue Reports", icon: icons.reports, path: null },
  { key: "settings", label: "Settings", icon: icons.settings, path: null },
];

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brand}>
          <span className={styles.brandTitle}>Sales Ledger</span>
          <span className={styles.brandSubtitle}>Enterprise Accounting</span>
        </div>

        <nav>
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) =>
              item.path ? (
                <li key={item.key}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `${styles.navItem} ${isActive ? styles.active : ""}`
                    }
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ) : (
                <li key={item.key}>
                  <span className={styles.navItem} aria-disabled="true">
                    <span className={styles.navIcon}>{item.icon}</span>
                    {item.label}
                  </span>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      <div className={styles.footerNav}>
        <button type="button" className={styles.footerItem}>
          <span className={styles.navIcon}>{icons.support}</span>
          Support
        </button>
        <button type="button" className={styles.footerItem}>
          <span className={styles.navIcon}>{icons.logout}</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
