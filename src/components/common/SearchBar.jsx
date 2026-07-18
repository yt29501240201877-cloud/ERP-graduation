import React from "react";
import PropTypes from "prop-types";
import styles from "./SearchBar.module.css";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    <line
      x1="21"
      y1="21"
      x2="16.65"
      y2="16.65"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Controlled search input. Deliberately dumb: it just reports raw
 * `onChange` events upward. Sanitization and debouncing happen in
 * the data layer (see services/invoiceService.js and useInvoices.js)
 * so this component stays reusable for any free-text search.
 */
function SearchBar({ value, onChange, placeholder = "Search...", maxLength = 100 }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>
        <SearchIcon />
      </span>
      <input
        type="text"
        className={styles.input}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
};

export default SearchBar;
