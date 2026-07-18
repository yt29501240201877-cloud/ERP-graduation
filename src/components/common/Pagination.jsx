import React from "react";
import PropTypes from "prop-types";
import styles from "./Pagination.module.css";

/**
 * Builds a compact page list, e.g. for 10 pages centered on page 5:
 * [1, "...", 4, 5, 6, "...", 10]. Keeps the pager readable even with
 * a large number of pages (we have 124 invoices / 3 per page = ~42).
 */
function buildPageList(current, total) {
  const delta = 1;
  const range = [];
  const rangeWithDots = [];
  let last;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (last) {
      if (i - last === 2) {
        rangeWithDots.push(last + 1);
      } else if (i - last > 2) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    last = i;
  }

  return rangeWithDots;
}

function Pagination({ page, totalPages, onPageChange, totalResults, resultsOnPage }) {
  const pages = buildPageList(page, totalPages);

  return (
    <div className={styles.wrapper}>
      <span className={styles.summary}>
        Showing {resultsOnPage} of {totalResults} results
      </span>

      <div className={styles.controls}>
        <button
          className={styles.arrow}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          &#8249;
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className={styles.dots}>
              &#8230;
            </span>
          ) : (
            <button
              key={p}
              className={`${styles.pageButton} ${p === page ? styles.active : ""}`}
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className={styles.arrow}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  totalResults: PropTypes.number.isRequired,
  resultsOnPage: PropTypes.number.isRequired,
};

export default Pagination;
