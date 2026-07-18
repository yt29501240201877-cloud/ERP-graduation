import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styles from "./AppLayout.module.css";

/**
 * Per-route Navbar configuration. Add an entry here whenever a new
 * page needs its own breadcrumb/search placeholder - pages
 * themselves never need to know about the Navbar.
 */
const ROUTE_META = {
  "/invoices": {
    moduleName: "ERP Finance",
    sectionName: "Accounts Payable",
    searchPlaceholder: "Search invoices...",
  },
  "/payments": {
    searchPlaceholder: "Search transactions...",
  },
};

const DEFAULT_META = { searchPlaceholder: "Search..." };

/**
 * Shell shared by every route: fixed Sidebar on the left, sticky
 * Navbar on top, routed page content in the middle.
 *
 * The Navbar's search input is owned here (not inside a page) so
 * it persists as one input across the layout. Its value is handed
 * to the active page through the router's Outlet context.
 */
function AppLayout() {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const meta = ROUTE_META[location.pathname] || DEFAULT_META;

  useEffect(() => {
    setSearchTerm("");
  }, [location.pathname]);

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Navbar
          moduleName={meta.moduleName}
          sectionName={meta.sectionName}
          searchPlaceholder={meta.searchPlaceholder}
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <div className={styles.content}>
          <Outlet context={{ searchTerm }} />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
