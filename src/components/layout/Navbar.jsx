import React from "react";
import PropTypes from "prop-types";
import SearchBar from "../common/SearchBar";
import { BellIcon, SettingsIcon, HelpIcon } from "../common/icons";
import styles from "./Navbar.module.css";

/**
 * Top bar shown on every page. Owns the global search input; the
 * active page reads its value via router context (see AppLayout)
 * so the same search box can drive different data behind each route.
 *
 * `moduleName`/`sectionName` are optional - pages that don't want a
 * breadcrumb (e.g. Payments, per its design) simply omit them.
 */
function Navbar({
  moduleName,
  sectionName,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  hasNotification = true,
}) {
  return (
    <header className={styles.navbar}>
      {moduleName ? (
        <div className={styles.breadcrumb}>
          <span className={styles.moduleName}>{moduleName}</span>
          {sectionName && (
            <>
              <span className={styles.divider}>|</span>
              <span className={styles.sectionName}>{sectionName}</span>
            </>
          )}
        </div>
      ) : (
        <SearchBar value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
      )}

      <div className={styles.actions}>
        {moduleName && (
          <SearchBar value={searchValue} onChange={onSearchChange} placeholder={searchPlaceholder} />
        )}

        <button type="button" className={styles.iconButton} aria-label="Notifications">
          <BellIcon />
          {hasNotification && <span className={styles.notificationDot} />}
        </button>

        <button type="button" className={styles.iconButton} aria-label="Settings">
          <SettingsIcon />
        </button>

        <button type="button" className={styles.iconButton} aria-label="Help">
          <HelpIcon />
        </button>

        <div className={styles.avatar} role="img" aria-label="User account">
          AT
        </div>
      </div>
    </header>
  );
}

Navbar.propTypes = {
  moduleName: PropTypes.string,
  sectionName: PropTypes.string,
  searchValue: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  hasNotification: PropTypes.bool,
};

export default Navbar;
