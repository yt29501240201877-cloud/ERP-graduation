import React from "react";
import PropTypes from "prop-types";
import Button from "../common/Button";
import { FilterIcon, SortIcon } from "../common/icons";

/**
 * Renders the two icon-only buttons in the table's top-right corner.
 * `onFilterClick` / `onSortClick` are optional so this can be dropped
 * in purely for visual parity before the behaviors are implemented.
 */
function FilterButton({ onFilterClick, onSortClick }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button variant="ghost" icon={<FilterIcon />} onClick={onFilterClick} ariaLabel="Filter invoices" />
      <Button variant="ghost" icon={<SortIcon />} onClick={onSortClick} ariaLabel="Sort invoices" />
    </div>
  );
}

FilterButton.propTypes = {
  onFilterClick: PropTypes.func,
  onSortClick: PropTypes.func,
};

export default FilterButton;
