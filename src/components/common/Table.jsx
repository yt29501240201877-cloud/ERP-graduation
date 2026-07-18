import React from "react";
import PropTypes from "prop-types";
import styles from "./Table.module.css";

/**
 * Generic, presentation-only table.
 *
 * - `columns` defines the header row (label + optional width/align).
 * - `rows` + `renderRow` let the caller control exactly how each row's
 *   cells are rendered (avatars, badges, action menus, etc.) while
 *   this component owns the shared chrome: header styling, hover
 *   effect, loading skeleton, and empty state.
 */
function Table({
  columns,
  rows,
  renderRow,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No records found.",
  skeletonRowCount = 3,
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{ width: col.width, textAlign: col.align || "left" }}
              className={styles.headerCell}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading &&
          Array.from({ length: skeletonRowCount }).map((_, i) => (
            <tr key={`skeleton-${i}`} className={styles.row}>
              {columns.map((col) => (
                <td key={col.key} className={styles.cell}>
                  <div className={styles.skeletonBar} />
                </td>
              ))}
            </tr>
          ))}

        {!isLoading && rows.length === 0 && (
          <tr>
            <td colSpan={columns.length} className={styles.emptyCell}>
              {emptyMessage}
            </td>
          </tr>
        )}

        {!isLoading &&
          rows.map((row, index) => renderRow(row, index, keyExtractor(row, index)))}
      </tbody>
    </table>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      header: PropTypes.node.isRequired,
      width: PropTypes.string,
      align: PropTypes.oneOf(["left", "center", "right"]),
    })
  ).isRequired,
  rows: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  emptyMessage: PropTypes.node,
  skeletonRowCount: PropTypes.number,
};

export default Table;
