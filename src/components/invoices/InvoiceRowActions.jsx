import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./InvoiceRowActions.module.css";

const DotsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="19" r="1.6" fill="currentColor" />
  </svg>
);

/**
 * Three-dot row menu. Closes on outside click and on Escape for
 * basic keyboard/accessibility support.
 */
function InvoiceRowActions({ invoice, onView, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const runAction = (fn) => {
    setIsOpen(false);
    fn?.(invoice);
  };

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Actions for invoice ${invoice.id}`}
      >
        <DotsIcon />
      </button>

      {isOpen && (
        <div className={styles.menu} role="menu">
          <button type="button" role="menuitem" onClick={() => runAction(onView)}>
            View details
          </button>
          <button type="button" role="menuitem" onClick={() => runAction(onEdit)}>
            Edit invoice
          </button>
          <button
            type="button"
            role="menuitem"
            className={styles.danger}
            onClick={() => runAction(onDelete)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

InvoiceRowActions.propTypes = {
  invoice: PropTypes.object.isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default InvoiceRowActions;
